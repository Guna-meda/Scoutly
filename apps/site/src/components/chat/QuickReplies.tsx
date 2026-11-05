import { Icon } from '../ui/Icon';

type Props = { send: string; edit: string; discard: string; sending: string; sent: string };

/**
 * SEND, EDIT and DISCARD drawn as a picture of a chat. They look like buttons but are plain,
 * non-interactive elements: no tabindex, no role, no handlers. The SEND label has three states
 * (SEND, Sending, Sent); CSS shows one, keyed on the stage's data-send attribute.
 */
export function QuickReplies({ send, edit, discard, sending, sent }: Props) {
  return (
    <div className="quick-replies">
      <span className="qr qr-send">
        <span className="lbl lbl-send">{send}</span>
        <span className="lbl lbl-sending">
          <span className="btn-spinner" aria-hidden="true" />
          {sending}
        </span>
        <span className="lbl lbl-sent">
          <Icon name="check-circle" size={16} />
          {sent}
        </span>
      </span>
      <span className="qr">{edit}</span>
      <span className="qr">{discard}</span>
    </div>
  );
}
