import {redirect} from 'react-router';

/** /collections → la tienda completa. */
export function loader() {
  return redirect('/collections/all', 301);
}
