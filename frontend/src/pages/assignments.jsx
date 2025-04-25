import AssignmentForm from "../components/AssignmentFormHandler";

export default function Assignments(){
    return (
        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Assignments</h1>
          <div className="space-y-4">
            <AssignmentForm name="Assignment 1" deadline="2022-12-21, 11:59PM" addInfo="test Information" course="Course 1" poster="Poster" postDate="2022-12-10, 10:00PM" isReturned={false} score="50" maxScore="100" remarks="remarksHere"/>
            <AssignmentForm name="Assignment 3" deadline="2023-10-20, 11:59PM" addInfo="Create A Website Showing Information about Pasig City" course="WEB DEVELOPMENT" poster="Mrs. Cruz" postDate="2023-10-20, 6:00PM" isReturned={true} score="80" maxScore="100" remarks="Magaling ka"/>
          </div>
        </div>
      );
}