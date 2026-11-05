type Props = { send: string; edit: string; discard: string };

/**
 * SEND, EDIT and DISCARD drawn as a picture of a chat. They look like buttons but are plain,
 * non-interactive elements: no tabindex, no role, no handlers. Their text is still readable.
 */
export function QuickReplies({ send, edit, discard }: Props) {
  return (
    <div className="quick-replies">
      <span className="qr qr-send">{send}</span>
      <span className="qr">{edit}</span>
      <span className="qr">{discard}</span>
    </div>
  );
}
