import { NavItem } from "#/constants.js";
import { Layout } from "#/components/layout.js";
import { Link } from "#/components/link.js";

export default function HomeScreen() {
  return (
    <div>
      <h1>Home</h1>
      <p>Home page content poop</p>

      <Link href="/poop/tree/ss">tree</Link>
    </div>
  );
}
