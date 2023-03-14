import './ResponseContainer.css';
import CodeDiff from '../CodeDiff/CodeDiff';

const ResponseContainer = ({searchResults}) => {
 return (
     <div className="ResponseContainer">
       <div className="responsePicContainer">
         <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="Avatar" className="avatar" />
       </div>
       <div className="codediffcontainer">
          <h3>Search Results :</h3>
                 {searchResults && (
                   <div>
                     <p>Name: {searchResults.name}</p>
                     <p>Age: {searchResults.age}</p>
                     <p>City: {searchResults.city}</p>
                   </div>
                 )}
       </div>
     </div>
 );
};

export default ResponseContainer;
