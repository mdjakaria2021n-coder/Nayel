import { cn } from '../lib/utils';
import { BIJOY_MAPPING, KEYBOARD_ROWS } from '../lib/bijoy-mapping';

interface VirtualKeyboardProps {
  expectedKey: string | null;
  pressedKey: string | null;
  onKeyClick?: (keyId: string) => void;
}

export default function VirtualKeyboard({ expectedKey, pressedKey, onKeyClick }: VirtualKeyboardProps) {
  let isShiftRequired = false;
  let targetBaseKey: string | null = null;
  
  if (expectedKey) {
    if (expectedKey.startsWith('Shift+')) {
      isShiftRequired = true;
      targetBaseKey = expectedKey.replace('Shift+', '').toLowerCase();
    } else if (expectedKey === 'Space') {
      targetBaseKey = 'space';
    } else {
      targetBaseKey = expectedKey.toLowerCase();
    }
  }

  let pressedBaseKey: string | null = null;
  let isPressedShift = false;
  if (pressedKey) {
    if (pressedKey.startsWith('Shift+')) {
      isPressedShift = true;
      pressedBaseKey = pressedKey.replace('Shift+', '').toLowerCase();
    } else if (pressedKey === 'Space') {
      pressedBaseKey = 'space';
    } else if (pressedKey.startsWith('Shift_')) {
      isPressedShift = true;
    } else {
      pressedBaseKey = pressedKey.toLowerCase();
    }
  }

  return (
    <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
      <div className="flex flex-col gap-[8px] p-[12px] bg-[#e2e8f0] rounded-[12px] select-none font-sans mt-8 mx-auto w-fit min-w-[800px]">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-[6px]">
            {row.map((keyId) => {
            const isSpecial = ['Backspace', 'Tab', 'Caps', 'Shift_L', 'Shift_R', 'Enter', 'Space'].includes(keyId);
            const mapping = BIJOY_MAPPING[keyId];
            
            const isTarget = (!isSpecial && targetBaseKey === keyId.toLowerCase()) || 
                             (keyId === 'Space' && targetBaseKey === 'space') ||
                             (isShiftRequired && (keyId === 'Shift_L' || keyId === 'Shift_R'));
                             
            const isPressed = (!isSpecial && pressedBaseKey === keyId.toLowerCase()) || 
                              (keyId === 'Space' && pressedBaseKey === 'space') ||
                              (isPressedShift && (keyId === 'Shift_L' || keyId === 'Shift_R'));

            let widthClass = 'w-[48px]';
            if (keyId === 'Backspace') widthClass = 'w-[90px]';
            if (keyId === 'Tab') widthClass = 'w-[70px]';
            if (keyId === 'Caps') widthClass = 'w-[80px]';
            if (keyId === 'Enter') widthClass = 'w-[90px]';
            if (keyId === 'Shift_L') widthClass = 'w-[110px]';
            if (keyId === 'Shift_R') widthClass = 'w-[110px]';
            if (keyId === 'Space') widthClass = 'w-[280px]';

            return (
              <div
                key={keyId}
                onClick={onKeyClick ? () => onKeyClick(keyId) : undefined}
                className={cn(
                  'relative h-[48px] flex flex-col justify-center items-center rounded-[6px] transition-all duration-100',
                  onKeyClick && 'cursor-pointer active:translate-y-[2px]',
                  widthClass,
                  'bg-[#ffffff] text-[#64748b] shadow-[0_2px_0_#cbd5e1]',
                  isTarget && !isPressed && 'ring-[4px] ring-[#2563eb]/30 border border-[#2563eb]',
                  isPressed && 'bg-[#2563eb] text-white shadow-[0_0_0_transparent] translate-y-[2px]'
                )}
              >
                {!isSpecial && mapping ? (
                  <>
                    <span className={cn("text-[10px] font-bold uppercase", isPressed ? "text-white" : "text-[#64748b] absolute top-[4px] left-[6px]")}>{keyId}</span>
                    <span className={cn("text-[10px] absolute top-[4px] right-[6px]", isPressed ? "text-white" : "text-[#64748b] opacity-80")}>{mapping.shift}</span>
                    <b className={cn("text-[16px] font-bold mt-[2px]", isPressed ? "text-white" : "text-[#1e293b]")}>{mapping.nom}</b>
                  </>
                ) : (
                  <span className={cn("text-[10px] font-bold uppercase", isPressed ? "text-white" : "text-[#64748b]")}>
                    {keyId.replace('_L', '').replace('_R', '')}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
      </div>
    </div>
  );
}
