function Footer() {
  return (
    <footer className=" bg-orange-500 py-6">
      <div className="flex flex-row justify-center items-center container mx-auto text-orange-200 text-center">
        <p>
          &copy; {new Date().getFullYear()} Pizza Palette. All rights reserved.
          Created with ♥ by{' '}
          <a
            href="https://bento.me/itxsaaad"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-orange-800 underline underline-offset-4"
          >
            Muhammad Saad
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
