import React, { useEffect, useState } from 'react';
import { decryptData } from '../../../../../chrome-extension/utils/Crypto';
import { encryptedSeedStorage } from '@extension/storage';

type SecretExportProps = {
  isLight: boolean;
  selectedAccount: {
    name: string;
    address: string;
  };
  passcode: string;
  onBack: () => void;
};

const SecretExport: React.FC<SecretExportProps> = ({ isLight, selectedAccount, passcode, onBack }) => {
  const [accountName, setAccountName] = useState(selectedAccount.name);
  const [accountAddress, setAccountAddress] = useState<string>('');
  const secretPhrase =
    'ritual exit feature face orient inflict hawk bike margin ridge ship ozone elevator bullet garden fitness close resource disorder ankle bright asset brisk jump';
  const [passcodeInput, setPasscodeInput] = useState<string>('');

  useEffect(() => {
    const loadAccountAddress = async () => {
      try {
        const encryptedSeed = await encryptedSeedStorage.getSeed();
        if (!encryptedSeed) {
          throw new Error('No seed found in storage.');
        }

        const seed = await decryptData(passcode, encryptedSeed);
        const accounts = [
          {
            name: 'Account #1',
            address: 'kaspatest:qzkstpzavl0xp479m573uhu3ujqj6u775vrtqrq0a7qzu0z2m89lq7hwkzgj4',
          },
          {
            name: 'Account #2',
            address: 'kaspatest:qz7d28dacezxdz066pzpkrrf2p45h2rr28evyedwmzlzer6kgvpvc36tjzvcj',
          },
        ];
        console.log('Generated accounts:', accounts);

        if (accounts && accounts.length > 0) {
          setAccountAddress(accounts[0].address);
        } else {
          throw new Error('No accounts generated.');
        }
      } catch (error) {
        console.error('Failed to load account address:', error);
      }
    };

    loadAccountAddress();
  }, [passcode]);

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const canShowSecret = passcode && isCheckboxChecked;

  const handleCopy = () => {
    navigator.clipboard.writeText(secretPhrase);
    console.log('Secret phrase copied to clipboard');
  };

  return (
    <div className="flex flex-col items-center justify-start w-full h-full p-4 pt-6 overflow-y-auto">
      <div className="w-full flex items-center mb-4">
        <button
          className={`text-2xl p-4 w-12 h-12 mr-4 ${isLight ? 'bg-gray-100' : 'bg-gray-800'} mb-2 hover:scale-105 transition duration-300 ease-in-out rounded-full font-bold text-[#70C7BA] flex items-center justify-center`}
          onClick={onBack}>
          ←
        </button>
        <h1 className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-gray-200'}`}>Secret Phrase</h1>
      </div>

      {/* Warning Messages */}
      <div className="w-full mb-6">
        <p className={`text-sm font-bold mb-2 ${isLight ? 'text-red-600' : 'text-red-400'}`}>
          Your secret phrase is the only way to recover your wallet.
        </p>
        <p className={`text-sm font-bold mb-6 ${isLight ? 'text-red-600' : 'text-red-400'}`}>
          Do not let anyone see your secret phrase.
        </p>
      </div>

      {/* Enter Passcode */}
      {!showSecret && (
        <div className="w-full mb-6">
          <label className={`block mb-2 text-sm font-bold ${isLight ? 'text-gray-900' : 'text-gray-200'}`}>
            Enter your passcode
          </label>
          <input
            type="password"
            value={passcodeInput}
            onChange={e => setPasscodeInput(e.target.value)}
            className={`w-full p-3 rounded-lg ${isLight ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-gray-200'}`}
          />
        </div>
      )}
      {/* Checkbox */}
      {!showSecret && (
        <div className="w-full flex items-start mb-4">
          <input
            type="checkbox"
            checked={isCheckboxChecked}
            onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
            className="mr-2"
            style={{ accentColor: '#70C7BA' }}
          />
          <label className={`text-sm ${isLight ? 'text-gray-900' : 'text-gray-200'}`}>
            I understand the risks of losing my funds if I share my secret phrase, even with the support team of KSPR
            Wallet.
          </label>
        </div>
      )}
      {/* Show me the Secret Phrase Button */}
      {!showSecret && (
        <div className="w-full mt-4">
          <button
            className={`w-full text-base mb-6 p-3 rounded-lg font-bold transition duration-300 ease-in-out ${
              isLight ? 'bg-[#70C7BA] text-white shadow-black' : 'bg-[#70C7BA] text-white'
            } hover:scale-105`}
            onClick={() => setShowSecret(true)}
            disabled={!canShowSecret} // Disable button unless conditions are met
          >
            Show me the Secret Phrase
          </button>
        </div>
      )}
      {/* Secret Phrase Display */}
      {showSecret && canShowSecret && (
        <div className="w-full mt-6">
          <label className={`block mb-2 text-sm font-bold ${isLight ? 'text-gray-900' : 'text-gray-200'}`}>
            Secret Phrase
          </label>

          <div className="relative">
            <p className={`p-3 rounded-lg ${isLight ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-gray-200'}`}>
              {secretPhrase}
            </p>
          </div>
          <button onClick={handleCopy} className="ml-2 hover:scale-105 mt-2">
            <img src="/popup/icons/copy.svg" alt="Copy" className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SecretExport;
