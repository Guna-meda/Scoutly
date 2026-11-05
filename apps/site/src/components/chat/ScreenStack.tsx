import { DeviceFrame } from '../device/DeviceFrame';
import { ChatHeader } from './ChatHeader';
import { screens } from './screens';

type Beat = 0 | 1 | 2;

/**
 * Three screens layered in one frame. `beat` is the only input: each screen gets
 * data-state = active | before | after. Inactive screens are hidden, aria-hidden and inert.
 * No transitions here; the cross-fade is added in W03.
 */
export function ScreenStack({ beat, size }: { beat: Beat; size?: 'auto' | 'desktop' | 'phone' }) {
  return (
    <DeviceFrame beat={beat} size={size}>
      <ChatHeader />
      <div className="chat-body">
        {screens.map((Screen, i) => {
          const state = i === beat ? 'active' : i < beat ? 'before' : 'after';
          const active = state === 'active';
          return (
            <div
              key={i}
              className="screen"
              data-state={state}
              aria-hidden={active ? undefined : true}
              inert={!active}
            >
              <Screen />
            </div>
          );
        })}
      </div>
    </DeviceFrame>
  );
}

/** The reduced-motion and no-JS layout: three frames in sequence, each fully visible. */
export function ScreenStacked({ size }: { size?: 'auto' | 'desktop' | 'phone' }) {
  return (
    <div className="flex flex-col items-center gap-8">
      {screens.map((Screen, i) => (
        <DeviceFrame key={i} beat={i as Beat} size={size}>
          <ChatHeader />
          <div className="chat-body">
            <div className="screen" data-state="active">
              <Screen />
            </div>
          </div>
        </DeviceFrame>
      ))}
    </div>
  );
}
