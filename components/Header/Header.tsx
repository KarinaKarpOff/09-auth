import Link from "next/link";
import AuthNavigation from "../AuthNavigation/AuthNavigation";
import css from "./Header.module.css";

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/notes/filter/all">Notes</Link>
          </li>
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}

// import Link from "next/link";
// import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";
// import css from "./Header.module.css";

// export default function Header() {
//   return (
//     <header className={css.header}>
//       <nav className={css.nav}>
//         <Link href="/" className={css.logo}>
//           NoteHub
//         </Link>
//         <ul className={css.navList}>
//           <li className={css.navigationItem}>
//             <Link href="/notes" className={css.navigationLink}>
//               Notes
//             </Link>
//           </li>
//           {/* Інші пункти меню, якщо є, і в кінці додаємо AuthNavigation */}
//           <AuthNavigation />
//         </ul>
//       </nav>
//     </header>
//   );
// }
