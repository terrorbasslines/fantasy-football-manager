import type { InboxMessage } from "../types/football";
import { shortDate } from "../utils/format";

export function Inbox({ messages }: { messages: InboxMessage[] }) {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Inbox</h1>
          <p>Board messages, match reports, player notes, transfer updates, and league news.</p>
        </div>
      </div>
      <div className="inbox-list">
        {messages.length ? messages.map((message) => (
          <article key={message.id} className="message">
            <span>{message.type} · {shortDate(message.date)}</span>
            <h3>{message.title}</h3>
            <p>{message.body}</p>
          </article>
        )) : <div className="empty">No messages yet.</div>}
      </div>
    </section>
  );
}
