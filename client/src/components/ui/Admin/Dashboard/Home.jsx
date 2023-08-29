import { useSelector } from 'react-redux';

function Home() {
  const user = useSelector((state) => state.user);
  const { loading, users, userDetails } = user;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4"></div>
  );
}

export default Home;
