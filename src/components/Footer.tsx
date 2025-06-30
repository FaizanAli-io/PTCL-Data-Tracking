import { Sparkles, Mail, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur border-t border-white/10 py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-white/70">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-400 animate-pulse" size={18} />
          <span>
            &copy; {new Date().getFullYear()}{" "}
            <strong className="text-white font-semibold">
              <br />
              The Byte Office.
            </strong>
            <br />
            All rights reserved. <br className="md:hidden" />
          </span>
        </div>
        <div className="flex flex-col items-start gap-2 text-white/60 w-max">
          <div className="flex justify-between w-full min-w-[120px]">
            <a href="mailto:thebyteoffice@gmail.com" className="hover:text-white transition">
              <Mail size={18} />
            </a>
            <a
              target="_blank"
              href="https://github.com/FaizanAli-io"
              className="hover:text-white transition"
            >
              <Github size={18} />
            </a>
            <a
              target="_blank"
              href="https://www.linkedin.com/in/faizan-ali-abdulali/"
              className="hover:text-white transition"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
