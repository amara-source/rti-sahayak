import { journeyCopy } from "@/content/journey-copy";

export function Checklist({ documents }: { documents: string[] }) {
  return (
    <section className="detail-section checklist">
      <h2>{journeyCopy.detail.documents}</h2>
      {documents.length > 0 ? (
        <ul>
          {documents.map((document) => (
            <li key={document}>
              <label>
                <input type="checkbox" />
                <span>{document}</span>
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p>{journeyCopy.detail.noDocuments}</p>
      )}
    </section>
  );
}
