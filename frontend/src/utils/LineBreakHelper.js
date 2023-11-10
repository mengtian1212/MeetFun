function LineBreakHelper(props) {
  if (!props || (props && !props.text)) return;
  const newText = props.text
    .split("\n")
    .map((str, idx) => <p key={idx}>{str}</p>);
  return newText;
}

export default LineBreakHelper;
