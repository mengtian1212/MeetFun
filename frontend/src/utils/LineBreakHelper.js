function LineBreakHelper(props) {
  const newText = props.text.split("\n").map((str) => <p>{str}</p>);
  return newText;
}

export default LineBreakHelper;
