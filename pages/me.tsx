import { signOut } from 'next-auth/react';
import Layout from '@/components/layout';

export default function Me() {
  const updatePassword = async (formData: any) => {
    try {
      const res = await fetch('/api/config', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          password: formData.password.value.trim(),
          newPassword: formData.newPassword.value.trim()
        })
      });
      if (res.status !== 200) {
        throw new Error(await res.text());
      }

      alert('Update password successfully!');
      signOut();
    } catch (ex: any) {
      alert(ex.toString());
    }
  };

  return (
    <Layout title="Update Password">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updatePassword(e.target);
        }}
      >
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" autoComplete="off" name="password" className="form-control" id="password" placeholder="Password" />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input type="password" autoComplete="off" name="newPassword" className="form-control" id="newPassword" placeholder="New Password" />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </Layout>
  );
}
