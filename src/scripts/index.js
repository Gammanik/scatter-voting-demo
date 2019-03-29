import ScatterJS from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs";
import Eos from "eosjs";

const voteProducer = () => {
  ScatterJS.plugins(new ScatterEOS());

  const network = {
    blockchain: "eos",
    protocol: "https",
    host: "nodes.get-scatter.com",
    port: 443,
    chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
  };

  const appName = "Minergate.com";
  ScatterJS.scatter.connect(appName).then(connected => {
    // If the user does not have Scatter or it is Locked or Closed this will return false;
    if (!connected) {
      getErrorScatter();
      return false;
    }

    const scatter = ScatterJS.scatter;

    // Now we need to get an identity from the user.
    // We're also going to require an account that is connected to the network we're using.
    const requiredFields = { accounts: [network] };
    scatter
      .getIdentity(requiredFields)
      .then(() => {
        const account = scatter.identity.accounts.find(
          x => x.blockchain === "eos"
        );

        const eosOptions = { expireInSeconds: 60 };

        const eos = scatter.eos(network, Eos, eosOptions);

        const transactionOptions = {
          authorization: [`${account.name}@${account.authority}`]
        };
        console.log('set proxy tr options: ', transactionOptions);


        const producersToVote = ["eosminergate"];
        return eos.voteproducer({ voter: account.name, proxy: "" , producers:  producersToVote },
          { transactionOptions });
      })
      .catch(error => {
        // The user rejected this request, or doesn't have the appropriate requirements.
        console.error('err identity: ', error);
      })
      .finally(() => {
        ScatterJS.scatter.forgetIdentity();
      });
  });
};


const getErrorScatter = () => {
  alert("Please log in to your Scatter");
};

window.onload = () => {
  document.getElementById("vote-for-us").addEventListener("click", voteProducer);
};
