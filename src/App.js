import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'
const BN = require("bn.js");

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {

  

  function getRandomItem(arr) {

    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);

    // get random item
    const item = arr[randomIndex];

    return item;
}

  const array = [
    "https://i.postimg.cc/mr4sVXPq/redpanda-1.png",
    "https://i.postimg.cc/3x55JSFR/redpanda-2.png",
    "https://i.postimg.cc/YSRJRpKG/redpanda-3.png",
    "https://i.postimg.cc/Pf0rYMMG/redpanda-4.png",
    "https://i.postimg.cc/3xF8MQQ7/redpanda-6.png",
    "https://i.postimg.cc/RZdBs1wZ/redpanda-7.png"

  ];

  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(false)

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false)

  const [tokenData, setTokenData] = React.useState([])

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
  React.useEffect(
    () => {
      // in this case, we only care to query the contract when signed in
      if (window.walletConnection.isSignedIn()) {

        // window.contract is set by initContract in index.js
        window.contract.nft_tokens_for_owner({ account_id: window.accountId })
          .then(response => {
       
            setTokenData(...response)

            if(response.length >0){
  
              setShowNotification(true)
            }
            
          })
      }
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    []
  )



  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Hello There!</h1>
       <p style={{ textAlign: 'center' }}>Ukrainian zoos are in severe need of help now and you can help by signing in</p>
        <p style={{ textAlign: 'center', marginTop: '3em' }}>
          <a className="neon-button" onClick={login}>Sign in</a>
        </p>
      </main>
    )
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <a style={{ float: 'right' }} onClick={logout}>
        Sign out
      </a>
      <main>
      <p style={{ textAlign: 'center' }}>There are no visitors in the zoos due to the ongoing war, which results in no budgeting. You can help by Minting an NFT,
       The funds raised will be allocated to buy food for animals or help zoos restore their work after the war is over.</p>

       <h5 style={{ textAlign: 'center' }}>You will get one of the below red panatas</h5>
        <div >
          <img className="img" src="https://i.postimg.cc/FsG3h84b/redpanda.jpg" width="550" height="400" />
        </div>
        <form onSubmit={async event => {
          event.preventDefault()

          
          // disable the form while the value gets updated on-chain
          fieldset.disabled = true

          try {
            // make an update call to the smart contract
            const supply_count = await window.contract.nft_total_supply()
            console.log("test"+JSON.stringify(supply_count))
            const media = getRandomItem(array);
            await window.contract.nft_mint({

              
                token_id: `#${supply_count}-ukrain-zoo-edition`,
                 token_owner_id: window.accountId,
                token_metadata: {
                  title: `UKRAIN ZOO NFT EDITION #${supply_count}`,
                  description: "For Ukrain - Zoo NFT",
                  media: media,
                },
               
              },
              300000000000000, // attached GAS (optional)
              new BN("1000000000000000000000000")

            )

          } catch (e) {
            alert(
              'Something went wrong! ' +
              'Maybe you need to sign out and back in? ' +
              'Check your browser console for more info.'
            )
            throw e
          } finally {
            // re-enable the form, whether the call succeeded or failed
            fieldset.disabled = false
          }

         
         

          // remove Notification again after css animation completes
          // this allows it to be shown again next time the form is submitted
          setTimeout(() => {
            setShowNotification(false)
          }, 11000)
        }}>
          <fieldset id="fieldset">
           { !showNotification && <p
              style={{ display: 'flex', alignContent: 'center', justifyContent:'center' }}
            >
             Click "Mint" below to mint an NFT to aid zoos in ukrain
            </p> }
          
            <div style={{ display: 'flex', alignContent: 'center', justifyContent:'center' }}>
              
              <button className="neon-button"
                disabled={buttonDisabled}
                
                
              >
                MINT
              </button>
            </div>
          </fieldset>
        </form>
       
      </main>
      {showNotification && <Notification />}
    </>
  )
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
  return (
    <div>
      <p style={{ textAlign: "center" }}>
                Thank You! Click   {" "}
                <a href={"https://wallet.testnet.near.org/?tab=collectibles"}>
                here
                </a>
                {" "}to see your NFT :)
      </p>
      
    </div>
  )
}
