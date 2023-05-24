import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      ©2020 - {new Date().getFullYear()}{' '}
      <a href="https://orai.io/" target="_blank">
        Oraichain Foundation
      </a>
    </footer>
  );
}
