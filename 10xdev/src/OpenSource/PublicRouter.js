import { useNavigate, useParams } from "react-router-dom";
import PublicWelcome from './PublicWelcome';

export const PublicRouter = () => {
  const {projectName} = useParams();
  return (
    <PublicWelcome projectName={projectName}/>
  )
  };
export default PublicRouter;
