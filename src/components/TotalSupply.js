import { useSelector} from "react-redux";
import config from '../config.json'


const TotalSupply = () => {
  const chainId = useSelector(state => state.provider.chainId)
  const totalSupply = useSelector((state) => state.tokens.totalSupply);


  return (
    <div className="component exchange__markets">
      {chainId && config[chainId] ? (
        
          <h1 style={{ textAlign: "center" }}>BUSD Balance: {totalSupply}</h1>
        
      ) : (
        <div>
          <p>Not Deployed to Network</p>
        </div>
      )}

      <hr />
    </div>
  );
}

export default TotalSupply;
