import "./LoadingPage.css";

function LoadingPage() {
  return (
    <div className="spinner">
      {/* <img src="../../image/Spin-1s-118px.gif" alt="Loading in progress"></img> */}

      <img
        // src="https://cdn.discordapp.com/attachments/1139263822469795862/1164982577736716288/Spin-1s-118px.gif"
        src="https://flavoreatsbucket.s3.us-west-2.amazonaws.com/Spin-1s-118px_copy.gif"
        alt="loading"
      />
    </div>
  );
}

export default LoadingPage;
