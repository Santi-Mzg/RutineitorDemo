
import { Link } from 'react-router-dom';

function Toolbar() {

    return (
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                <Link to="/workout">
                    <h1 className="navbar-brand">Rutineitor</h1>
                </Link>
                <ul className='flex gap-x-2'>
                        <>
                            <li className="flex">
                                <h2 className='text-lg font-medium text-gray-600 py-2 pr-10'></h2>
                            </li>
                        </>
                </ul>
            </div>
        </nav>
    )
}

export default Toolbar