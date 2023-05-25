import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout';

export default function Home() {
  const [config, setConfig] = useState<any>();
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then(setConfig);
  }, []);

  const switchRunning = async (running: boolean) => {
    try {
      await fetch('/api/config', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ running })
      });
      setConfig({ ...config, running });
    } catch (ex: any) {
      alert(ex.toString());
    }
  };

  const updateConfig = async (formData: any) => {
    try {
      await fetch('/api/config', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(formData)
      });
      alert('Update config successfully!');
    } catch (ex: any) {
      alert(ex.toString());
    }
  };

  return (
    <Layout title="Market Maker Bot Configuration">
      {config && (
        <>
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className={`btn btn-${config.running ? 'primary' : 'secondary'}`} onClick={() => switchRunning(true)}>
              <input type="radio" name="options" autoComplete="off" /> Start
            </label>
            <label className={`btn btn-${!config.running ? 'primary' : 'secondary'}`} onClick={() => switchRunning(false)}>
              <input type="radio" name="options" autoComplete="off" /> Stop
            </label>
          </div>
          <Form
            schema={config.schema}
            validator={validator}
            formData={config.formData}
            uiSchema={config.uiSchema}
            onSubmit={({ formData }) => {
              updateConfig(formData);
            }}
          />
        </>
      )}
    </Layout>
  );
}
