import { Github, Heart, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="rounded-xl border border-border bg-card/70 px-5 py-4 backdrop-blur-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span>Made with</span>
                    <Heart className="h-4 w-4 fill-rose-500 text-rose-500" aria-hidden="true" />
                    <span>by Pedro Castellanos Alonso</span>
                </p>

                <div className="flex items-center gap-3">
                    <a
                        href="https://github.com/pedrocastellanos/"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub de Pedro Castellanos"
                        className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                        <Github className="h-4 w-4" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/pedro-castellanos-alonso-23a904166/"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn de Pedro Castellanos"
                        className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                        <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                        href="https://instagram.com/pedrocastellanos2003/"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Instagram de Pedro Castellanos"
                        className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                        <Instagram className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </footer>
    )
}
