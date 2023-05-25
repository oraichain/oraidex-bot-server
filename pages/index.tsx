import { useState } from 'react';
import Layout from '@/components/layout';

export default function EncryptPage() {
  const [encrypted, setEncrypted] = useState('');
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const encryptMnemonic = async () => {
    const encrypted = await fetch('/api/crypto', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ password, mnemonic })
    }).then((res) => res.text());
    setEncrypted(encrypted);
  };

  return (
    <Layout title="Create Encrypted Mnemonic">
      <form>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" autoComplete="off" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value.trim())} placeholder="Password" />
        </div>
        <div className="form-group">
          <label className="form-check-label" htmlFor="mnemonic">
            Mnemonic
          </label>
          <textarea className="form-control" id="mnemonic" value={mnemonic} onChange={(e) => setMnemonic(e.target.value)} rows={3}></textarea>
        </div>
        <button type="button" className="btn btn-primary" onClick={encryptMnemonic}>
          Submit
        </button>
        <div className="form-group mt-4">
          <label htmlFor="result">Encrypted Mnemonic</label>
          <input type="text" id="result" className="form-control" readOnly value={encrypted} />
        </div>
      </form>
    </Layout>
  );
}
