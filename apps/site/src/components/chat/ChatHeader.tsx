import { stage } from '@content/en';
import { Mark } from '../ui/Mark';

/** Avatar on an ink circle, name, role. */
export function ChatHeader() {
  return (
    <div className="chat-header">
      <span className="chat-avatar">
        <Mark size={22} />
      </span>
      <div className="chat-title">
        <span className="chat-name">{stage.device.name}</span>
        <span className="chat-role">{stage.device.role}</span>
      </div>
    </div>
  );
}
