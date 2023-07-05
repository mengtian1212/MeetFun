function LineBreakHelper(props) {
  const newText = props.text
    .split("\n")
    .map((str, idx) => <p key={idx}>{str}</p>);
  return newText;
}

export default LineBreakHelper;
