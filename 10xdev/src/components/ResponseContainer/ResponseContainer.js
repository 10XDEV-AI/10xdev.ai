import './ResponseContainer.css';
import CodeDiff from '../CodeDiff/CodeDiff';
import AI_Image from '../../images/10x.png';

const ResponseContainer = ({searchResults}) => {
 return (
     <div className="ResponseContainer">
       <div className="responsePicContainer">
         <img src={AI_Image} alt="Avatar" className="avatar" />
       </div>
       <div className="codediffcontainer">
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
