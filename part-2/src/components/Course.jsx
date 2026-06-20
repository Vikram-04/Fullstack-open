import Total from "./Total";
import Content from "./Content";
import Header from "./Header";
const Course = ({ course }) => {
  return (
    <div>
      <Header text={course.name}></Header>
      <Content parts={course.parts}></Content>
      <Total parts={course.parts}></Total>
    </div>
  );
};

export default Course;
