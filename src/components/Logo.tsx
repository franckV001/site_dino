export default function Logo({ className = "w-40 h-auto" }: { className?: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 2983 350"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ maxWidth: "100%", overflow: "visible" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
          .logo-text {
            font-family: 'Orbitron', sans-serif;
            font-weight: 300;
            font-size: 90px;
            fill: #ffffff;
          }
          .logo-text-v {
            font-family: 'Orbitron', sans-serif;
            font-weight: 300;
            font-size: 90px;
            fill: #f00;
          }
        `}</style>
      </defs>

      {/* Box 1 - Light Gray */}
      <path
        d="M337.571,147.361l-168.725,0l0,168.729l168.725,0l0,-168.729Zm-25.958,25.958l0,116.813l-116.813,0l0,-116.813l116.813,0Z"
        style={{ fill: "#eaeaeb" }}
      />

      {/* Box 2 - Light Gray */}
      <path
        d="M344.571,-11.193l-317.979,0l0,317.983l317.979,0l0,-317.983Zm-25.95,25.958l0,266.071l-266.075,0l0,-266.071l266.075,0Z"
        style={{ fill: "#eaeaeb" }}
      />

      {/* Box 3 - Red */}
      <path
        d="M325.004,163.798l-168.725,0l0,168.725l168.725,0l0,-168.725Zm-25.954,25.958l0,116.812l-116.808,0l0,-116.812l116.808,0Z"
        style={{ fill: "#ee3d2d" }}
      />

      {/* Box 4 - Gray */}
      <path
        d="M325.004,14.544l-317.979,0l0,317.979l317.979,0l0,-317.979Zm-25.954,25.954l0,266.071l-266.071,0l0,-266.071l266.071,0Z"
        style={{ fill: "#a0a9ac" }}
      />

      {/* Text */}
      <g transform="matrix(4.166667,0,0,4.166667,-164.70346,-1130.528188)">
        <text x="124.158px" y="348.316px" className="logo-text">
          F<tspan x="205.557px 296.657px 388.857px 480.656px 571.456px " y="348.316px 348.316px 348.316px 348.316px 348.316px ">RANCK</tspan>
        </text>
        <text x="659.756px" y="348.316px" className="logo-text-v">
          V
        </text>
      </g>
    </svg>
  );
}
