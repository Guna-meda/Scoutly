import { stage } from '@content/en';
import { Mark } from '../ui/Mark';
import { Pill } from '../ui/Pill';

/** Avatar on an ink circle, name, role and the SAMPLE tag. */
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
      <Pill tone="lime" kind="tag">
        {stage.device.sampleTag}
      </Pill>
    </div>
  );
}
