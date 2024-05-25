import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import Loading from "../../components/Loading";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return null;
};

export default function App() {
  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <div className={styles.container}>
          <img
            className={styles.logo}
            src="suavecito-s-logo-color.png"
            alt="Suavecito Functions"
          />
          <div className={styles.formula}>
            <span className={styles.paran}>(</span>
            <span className={styles.animation}>
              <Loading />
            </span>
            <span className={styles.paran}>)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
