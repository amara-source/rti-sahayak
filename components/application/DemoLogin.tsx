"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LangSwitch } from "@/components/layout/LangSwitch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { shellCopy } from "@/content/shell-copy";

export function DemoLogin() {
  const router = useRouter();
  const [chooserOpen, setChooserOpen] = useState(false);

  function choosePersona(id: string) {
    window.localStorage.setItem("umang-demo-persona", id);
    router.push("/dashboard");
  }

  return (
    <section className="login-screen">
      <div className="login-visual" aria-hidden="true">
        <div className="login-network">
          <span /><span /><span /><span /><span />
        </div>
        <div className="login-wordmark">
          <span>U</span>
          <strong>UMANG</strong>
        </div>
      </div>
      <div className="login-form-side">
        <article className="login-card">
          <div className="login-card__utilities">
            <ThemeToggle />
            <LangSwitch />
          </div>
          <h1>{shellCopy.login.heading}</h1>
          <p>{shellCopy.login.welcome}</p>
          <strong className="login-prototype-note">{shellCopy.login.prototypeNote}</strong>
          <label>
            <span>{shellCopy.login.mobile}</span>
            <input
              onClick={() => setChooserOpen(true)}
              placeholder={shellCopy.login.mobilePlaceholder}
              readOnly
              type="tel"
            />
          </label>
          <label>
            <span>{shellCopy.login.mpin}</span>
            <input
              onClick={() => setChooserOpen(true)}
              placeholder={shellCopy.login.mpinPlaceholder}
              readOnly
              type="password"
            />
          </label>
          <button className="login-text-action" onClick={() => setChooserOpen(true)} type="button">
            {shellCopy.login.forgot}
          </button>
          <button className="login-primary" onClick={() => setChooserOpen(true)} type="button">
            {shellCopy.login.login}
          </button>
          <button className="login-secondary" onClick={() => setChooserOpen(true)} type="button">
            {shellCopy.login.otp}
          </button>
          <p className="login-register">
            {shellCopy.login.registerLead}{" "}
            <button onClick={() => setChooserOpen(true)} type="button">{shellCopy.login.register}</button>
          </p>
          <div className="login-divider"><span>{shellCopy.login.divider}</span></div>
          <button className="login-secondary" onClick={() => setChooserOpen(true)} type="button">
            {shellCopy.login.sso}
          </button>
        </article>
      </div>

      {chooserOpen ? (
        <div className="persona-dialog" role="dialog" aria-modal="true" aria-labelledby="persona-heading">
          <div className="persona-dialog__card">
            <button aria-label={shellCopy.login.close} className="persona-dialog__close" onClick={() => setChooserOpen(false)} type="button">×</button>
            <h2 id="persona-heading">{shellCopy.login.chooseHeading}</h2>
            <p>{shellCopy.login.chooseDescription}</p>
            <div>
              {shellCopy.personas.map((persona) => (
                <button key={persona.id} onClick={() => choosePersona(persona.id)} type="button">
                  <span>{persona.initials}</span>
                  <strong>{persona.name}</strong>
                  <small>{persona.state}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
