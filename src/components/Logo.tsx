import logo from '/Keyp-Nastuferd-logo-green.svg';

export const Logo = () => (
  <div className="flex justify-center mb-16">
    <div className="flex items-center gap-2">
      <img 
        src={logo} 
        alt="Keyp Næstuferð" 
        className="w-96 h-auto" 
        loading="eager"
      />
    </div>
  </div>
);