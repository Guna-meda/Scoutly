import { Icon } from '../ui/Icon';
import { Bubble } from './Bubble';

type Props = { name: string };

/** The user's outgoing file message. */
export function FileBubble({ name }: Props) {
  return (
    <Bubble from="out">
      <div className="file-row">
        <span className="file-icon">
          <Icon name="doc" size={22} />
        </span>
        <span className="file-meta">
          <span className="file-name">{name}</span>
        </span>
        <Icon name="paperclip" size={22} className="rw-clip" />
      </div>
    </Bubble>
  );
}
