import { Link } from 'react-router';
import { useDocumentTitle } from '../lib/documentTitle';

export default function Home() {
    useDocumentTitle('Home');

    return (
        <>
            <section className="border-b border-ink/10 bg-white">
                <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-20">
                    <div>
                        <p className="text-xs font-bold tracking-[0.14em] text-gold uppercase">Warehouse cold chain</p>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink lg:text-5xl">
                            See the warehouse clearly.
                        </h1>
                        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/75">
                            Redmoore helps warehouse teams watch temperature, humidity, and how full a site is — in one
                            place. No extra dashboards. Just the numbers people need on the floor.
                        </p>
                        <Link
                            to="/operations"
                            className="mt-8 inline-flex rounded-sm bg-crimson px-5 py-2.5 text-sm font-bold text-white hover:bg-crimson-dark"
                        >
                            Open the operations demo
                        </Link>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80"
                        alt="Pallet racking in a distribution warehouse. Photo by CHUTTERSNAP on Unsplash"
                        width={1400}
                        height={900}
                        decoding="async"
                        className="h-72 w-full rounded-sm object-cover lg:h-[26rem]"
                    />
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
                <img
                    src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=80"
                    alt="Loaded pallets inside a logistics warehouse. Photo by CHUTTERSNAP on Unsplash"
                    width={1400}
                    height={900}
                    decoding="async"
                    className="order-2 h-64 w-full rounded-sm object-cover lg:order-1"
                />
                <div className="order-1 lg:order-2">
                    <h2 className="text-2xl font-bold text-ink">Built for cold stores</h2>
                    <p className="mt-3 leading-relaxed text-ink/75">
                        Five UK sites in this demo: Milton Keynes, Doncaster, Daventry, Warrington, and Tilbury. Each
                        site reports temperature, humidity, and fill level. Alerts can be acknowledged so the board
                        stays current.
                    </p>
                </div>
            </section>

            <section className="border-t border-ink/10 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-12">
                    <aside className="max-w-2xl rounded-sm border border-gold/50 bg-paper px-5 py-4 text-sm leading-relaxed text-ink/75">
                        <p className="font-bold text-ink">Portfolio MVP</p>
                        <p className="mt-2">
                            This is a small public demo for interview conversations. There are no user accounts. Data is
                            generated. One action is saved: acknowledging an alert. Hosted on Render’s free tier, so the
                            first load after a quiet spell can take a minute.
                        </p>
                    </aside>
                </div>
            </section>
        </>
    );
}
