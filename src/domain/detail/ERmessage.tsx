import TabButton from "./TabButton"

function ERmessage() {

  const ER = [
    {
      id: 1,
      title: "안과",
    },
    {
      id: 2,
      title: "소아청소년과",
    },
    {
      id: 3,
      title: "피부과",
    },
    {
      id: 4,
      title: "치과",
    },
    {
      id: 5,
      title: "성형외과",
    },
    {
      id: 6,
      title: "응급실",
    },
    {
      id: 7,
      title: "응급내시경",
    },
  ];

  return (
    <>
      <h2>응급실 메세지</h2>
      {ER.map(({title}) => (
        <TabButton title={title} active={active} />
      ))}
    </>
  );
}
export default ERmessage