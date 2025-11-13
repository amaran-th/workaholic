import Link from "next/link";

export default async function Footer() {
  return (
    <>
      <footer className="flex flex-col gap-8 px-12 py4 text-xs text-secondary bg-secondary-foreground py-4">
        <section className="flex gap-8">
          <div className="flex flex-col gap-2 flex-2">
            <p className="font-bold text-lg text-white">일을:하자</p>
            <p className="_1uz58ls3">
              Copyright © 2025 일을:하자. All rights reserved.
            </p>
          </div>
          {/* <div className="flex flex-col gap-2 flex-1">
            <h3 className="font-bold text-md text-white">Contact</h3>
            <Link href="mailto:@gmail.com" className="_1uz58lsa">
              @gmail.com
            </Link>
          </div> */}
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="font-bold text-md text-white">Socials</h3>
            {/* <Link
              href=""
              className="_1uz58lsa"
              rel="noopener noreferrer"
            >
              Velog
            </Link> */}
            <Link
              href="https://github.com/amaran-th/workaholic"
              rel="noopener noreferrer"
            >
              Github
            </Link>
          </div>
          <section className="flex flex-col gap-2 flex-1">
            <h3 className="font-bold text-md text-white">Etc</h3>
            {/* <Link
              href=""
              rel="noopener noreferrer"
            >
              팀 소개
            </Link> */}
            <Link
              href="https://github.com/amaran-th/workaholic/discussions"
              rel="noopener noreferrer"
            >
              서비스 피드백
            </Link>
          </section>
        </section>
        <section className="text-center">
          이 웹사이트에는{" "}
          <Link
            href="https://campaign.naver.com/nanumsquare_neo/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}
          >
            네이버에서 제공한 나눔스퀘어 네오 글꼴
          </Link>
          이 적용되어 있습니다. © NAVER Corp.
        </section>
      </footer>
    </>
  );
}
