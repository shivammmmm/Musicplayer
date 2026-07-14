import { Camera, Gauge, MoveLeft, MoveRight } from 'lucide-react';
import { DriveInput } from './DriveGame';
import { MutableRefObject } from 'react';

interface Props { inputRef: MutableRefObject<DriveInput>; speed: number; cameraMode: 'chase' | 'cockpit'; onCameraToggle: () => void }

export function DriveControls({ inputRef, speed, cameraMode, onCameraToggle }: Props) {
  const hold = (key: keyof DriveInput, value: boolean) => () => { inputRef.current[key] = value; };
  const button = (key: keyof DriveInput, icon: React.ReactNode, label: string) => <button aria-label={label} title={label}
    onPointerDown={hold(key, true)} onPointerUp={hold(key, false)} onPointerLeave={hold(key, false)}
    className="drive-button">{icon}</button>;
  return <>
    <div className="fixed left-5 bottom-28 z-40 flex gap-3 touch-none">
      {button('left', <MoveLeft />, 'Steer left')}{button('right', <MoveRight />, 'Steer right')}
    </div>
    <div className="fixed right-5 bottom-28 z-40 flex gap-3 touch-none">
      {button('brake', <span className="text-xs font-black">BRAKE</span>, 'Brake')}{button('accelerate', <span className="text-xs font-black">GO</span>, 'Accelerate')}
    </div>
    <div className="fixed right-5 top-5 z-40 flex items-center gap-2">
      <div className="hud-chip"><Gauge className="w-4 h-4 text-amber-400" /><strong>{speed}</strong><span>km/h</span></div>
      <button className="hud-icon" onClick={onCameraToggle} title={`Switch to ${cameraMode === 'chase' ? 'cockpit' : 'chase'} view`}><Camera /></button>
    </div>
  </>;
}
