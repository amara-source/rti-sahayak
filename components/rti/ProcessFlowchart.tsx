"use client";

import Link from "next/link";
import { useCopy } from "@/lib/i18n/LanguageProvider";
import type { Plan, RenderedNode } from "@/lib/engine/types";
import { Icon } from "./Icon";

type FlowId =
  | "request"
  | "transfer"
  | "reply"
  | "no_reply"
  | "first"
  | "decision"
  | "no_decision"
  | "second"
  | "commission"
  | "complaint";

type FlowState = "complete" | "current" | "available" | "locked";

type FlowStates = Record<FlowId, FlowState>;

interface FlowNode {
  id: FlowId;
  label: string[];
  x: number;
  y: number;
  href?: string;
}

const FIRST_APPEAL_DECISION_DAYS = 45;

/**
 * Every state here is read from the engine's rendered nodes. The diagram
 * decides nothing: it draws whatever the deterministic journey already says.
 */
function flowStates(plan: Plan, nodes: RenderedNode[]): FlowStates {
  const find = (id: string) => nodes.find((node) => node.id === id);
  const status = (id: string) => plan.statuses[id] ?? "none";
  const done = (id: string) => status(id) === "done";
  const applied = (id: string) => status(id) === "applied";
  const unlocked = (id: string) => Boolean(find(id) && !find(id)!.locked);

  const deemedFired = Boolean(find("deemed_refusal")?.fired);
  const replyLapsed = Boolean(find("await_reply")?.lapsed);
  const transferLapsed = Boolean(find("transfer_window")?.lapsed);
  const appealStarted = plan.startedAtHours?.first_appeal;
  const appealElapsedDays =
    appealStarted === undefined
      ? 0
      : Math.max(0, Math.floor(((plan.elapsedHours ?? 0) - appealStarted) / 24));
  const appealRanOut = appealElapsedDays > FIRST_APPEAL_DECISION_DAYS;

  const ladder = (id: string): FlowState =>
    done(id)
      ? "complete"
      : applied(id)
        ? "current"
        : unlocked(id)
          ? "available"
          : "locked";

  const firstState = ladder("first_appeal");
  const decided = done("first_appeal");

  return {
    request: done("submit") ? "complete" : "current",
    transfer: done("transfer_window")
      ? "complete"
      : applied("transfer_window")
        ? "current"
        : transferLapsed
          ? "locked"
          : "available",
    // Reply and no reply are the two branches out of the waiting period.
    // Only one of them is ever travelled.
    reply: done("await_reply") && !deemedFired ? "complete" : "locked",
    no_reply: deemedFired
      ? firstState === "locked" || firstState === "available"
        ? "current"
        : "complete"
      : replyLapsed
        ? "current"
        : "locked",
    first: firstState,
    decision: decided && !appealRanOut ? "complete" : "locked",
    no_decision: decided && appealRanOut ? "complete" : "locked",
    second: ladder("second_appeal"),
    commission: ladder("commission_decision"),
    complaint: ladder("section_18_complaint"),
  };
}

const reached = (state: FlowState) =>
  state === "complete" || state === "current";

function NodeBox({
  node,
  state,
}: {
  node: FlowNode;
  state: FlowState;
}) {
  const content = (
    <g
      className={`rti-process-node is-${state}`}
      transform={`translate(${node.x} ${node.y})`}
    >
      <rect height="92" rx="20" width="230" x="-115" y="-46" />
      <text textAnchor="middle">
        {node.label.map((line, index) => (
          <tspan
            dy={index === 0 ? (node.label.length === 1 ? 7 : -4) : 23}
            key={line}
            x="0"
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );

  return node.href && state !== "locked" ? (
    <Link href={node.href}>{content}</Link>
  ) : (
    content
  );
}

/**
 * Each edge is drawn twice: a faint base line that is always present, and an
 * overlay that draws itself in when the path becomes travelled. pathLength=1
 * lets a single transition work for paths of very different lengths.
 */
function Edge({ d, active }: { d: string; active: boolean }) {
  return (
    <>
      <path className="rti-process-edge" d={d} />
      <path
        className={active ? "rti-process-edge__draw is-active" : "rti-process-edge__draw"}
        d={d}
        pathLength={1}
      />
    </>
  );
}

function DesktopMap({ plan, nodes }: { plan: Plan; nodes: RenderedNode[] }) {
  // Interface copy in the selected language, English where untranslated.
  const { rti: rtiCopy } = useCopy();
  const copy = rtiCopy.tracker.flow;
  const states = flowStates(plan, nodes);
  const code = plan.code;
  const wait = plan.answers.lifeLiberty === "yes" ? "48 hours" : "30 days";

  const items: FlowNode[] = [
    { id: "request", label: [copy.request], x: 190, y: 100 },
    { id: "transfer", label: [copy.transfer], x: 190, y: 300 },
    { id: "reply", label: [copy.reply], x: 495, y: 300 },
    { id: "no_reply", label: [copy.noReply], x: 785, y: 300 },
    { id: "first", label: [copy.first], x: 645, y: 520, href: "/appeal/first" },
    { id: "decision", label: [copy.decision], x: 495, y: 730 },
    { id: "no_decision", label: [copy.noDecision], x: 785, y: 730 },
    { id: "second", label: [copy.second], x: 645, y: 940, href: "/appeal/second" },
    { id: "commission", label: [...copy.commission], x: 645, y: 1150 },
    { id: "complaint", label: [...copy.complaint], x: 1010, y: 100, href: "/complaint" },
  ];

  const edges = [
    { d: "M305 100H495V254", active: reached(states.reply) },
    { d: "M305 100H785V254", active: reached(states.no_reply) },
    { d: "M190 146V254", active: reached(states.transfer) },
    { d: "M305 300H380", active: reached(states.transfer) && reached(states.reply) },
    { d: "M495 346V420H645V474", active: reached(states.first) && reached(states.reply) },
    { d: "M785 346V420H645V474", active: reached(states.no_reply) && reached(states.first) },
    { d: "M645 566V630H495V684", active: reached(states.decision) },
    { d: "M645 566V630H785V684", active: reached(states.no_decision) },
    { d: "M495 776V850H645V894", active: reached(states.second) },
    { d: "M785 776V850H645V894", active: reached(states.second) },
    { d: "M645 986V1104", active: reached(states.commission) },
    { d: "M305 75H895", active: reached(states.complaint) },
  ];

  return (
    <svg
      aria-labelledby={`flow-title-${code} flow-desc-${code}`}
      className="rti-process-map__desktop"
      role="img"
      viewBox="0 0 1180 1220"
    >
      <title id={`flow-title-${code}`}>{copy.title}</title>
      <desc id={`flow-desc-${code}`}>{copy.description}</desc>
      <defs>
        <marker id={`arrow-${code}`} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0 0L8 4L0 8Z" />
        </marker>
      </defs>
      <g markerEnd={`url(#arrow-${code})`}>
        {edges.map((item) => (
          <Edge active={item.active} d={item.d} key={item.d} />
        ))}
      </g>
      <g className="rti-process-labels">
        <text x="470" y="86">{wait}</text>
        <text x="700" y="126">{wait}</text>
        <text x="205" y="208">{copy.withinFive}</text>
        <text x="310" y="287">{copy.again(wait)}</text>
        <text x="500" y="405">{copy.unsatisfactory}</text>
        <text x="735" y="405">{copy.fileFirst}</text>
        <text x="490" y="615">{copy.withinFortyFive}</text>
        <text x="720" y="615">{copy.afterFortyFive}</text>
        <text x="500" y="835">{copy.withinNinety}</text>
        <text x="800" y="835">{copy.withinNinety}</text>
        <text x="660" y="60">{copy.noLimit}</text>
        <text x="660" y="1050">{copy.commissionDecides}</text>
      </g>
      {items.map((node) => (
        <NodeBox key={node.id} node={node} state={states[node.id]} />
      ))}
    </svg>
  );
}

interface Step {
  id: FlowId;
  label: string;
  meta: string;
  href?: string;
  tag?: string;
}

/**
 * Narrow screens get a real vertical stepper rather than a shrunken diagram,
 * because the government's own version is an image nobody can read on a phone.
 */
function MobileStepper({ plan, nodes }: { plan: Plan; nodes: RenderedNode[] }) {
  // Interface copy in the selected language, English where untranslated.
  const { rti: rtiCopy } = useCopy();
  const copy = rtiCopy.tracker.flow;
  const states = flowStates(plan, nodes);
  const wait = plan.answers.lifeLiberty === "yes" ? "48 hours" : "30 days";

  const steps: Step[] = [
    { id: "request", label: copy.request, meta: wait },
    { id: "transfer", label: copy.transfer, meta: copy.withinFive },
    { id: "reply", label: copy.reply, meta: wait, tag: copy.outcome },
    { id: "no_reply", label: copy.noReply, meta: wait, tag: copy.outcome },
    { id: "first", label: copy.first, meta: copy.fileFirst, href: "/appeal/first" },
    { id: "decision", label: copy.decision, meta: copy.withinFortyFive, tag: copy.outcome },
    { id: "no_decision", label: copy.noDecision, meta: copy.afterFortyFive, tag: copy.outcome },
    { id: "second", label: copy.second, meta: copy.withinNinety, href: "/appeal/second" },
    { id: "commission", label: copy.commission.join(" "), meta: copy.commissionDecides },
    { id: "complaint", label: copy.complaint.join(" "), meta: copy.noLimit, href: "/complaint", tag: copy.parallel },
  ];

  return (
    <ol aria-label={copy.title} className="rti-process-stepper">
      {steps.map((step) => {
        const state = states[step.id];
        return (
          <li className={`rti-process-step is-${state}`} key={step.id}>
            <span aria-hidden="true" className="rti-process-step__marker" />
            <div className="rti-process-step__body">
              <p className="rti-process-step__label">
                {step.label}
                {step.tag ? <em>{step.tag}</em> : null}
              </p>
              <p className="rti-process-step__meta">
                <span>{copy.states[state]}</span>
                {step.meta}
              </p>
              {step.href && state !== "locked" ? (
                <Link href={step.href}>{copy.open}</Link>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ProcessFlowchart({
  plan,
  nodes,
}: {
  plan: Plan;
  nodes: RenderedNode[];
}) {
  // Interface copy in the selected language, English where untranslated.
  const { rti: rtiCopy } = useCopy();
  return (
    <section className="rti-process-card" aria-labelledby="rti-process-heading">
      <div className="rti-process-card__heading">
        <span className="rti-icon-tile"><Icon name="route" /></span>
        <p>{rtiCopy.tracker.flow.eyebrow}</p>
        <h2 id="rti-process-heading">{rtiCopy.tracker.flow.heading}</h2>
      </div>
      <div className="rti-process-map">
        <DesktopMap nodes={nodes} plan={plan} />
        <MobileStepper nodes={nodes} plan={plan} />
      </div>
      <p className="rti-process-caption">{rtiCopy.tracker.flow.caption}</p>
    </section>
  );
}
