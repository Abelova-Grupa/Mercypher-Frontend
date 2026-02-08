interface CodeInputFieldProps {
  index: number;
  handleCellInput: (e: React.ChangeEvent<HTMLInputElement>, i: number) => void;
  handleBackSpacePress: (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number,
  ) => void;
  inputRef: (el: HTMLInputElement | null) => void;
}

export default function CodeInputField(props: CodeInputFieldProps) {
  return (
    <div>
      <input
        type="text"
        id={`${props.index}`}
        className="code-cell"
        maxLength={1}
        onKeyDown={(e) => props.handleBackSpacePress(e, props.index)}
        onChange={(e) => props.handleCellInput(e, props.index)}
        key={`${props.index}`}
        ref={props.inputRef}
      />
    </div>
  );
}
