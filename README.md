# 일을:하자
## 프로젝트 소개
아이젠하우어 매트릭스* 기반의 업무 관리 플랫폼

- [블로그](https://amaran-th.vercel.app/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%9D%BC%EC%9D%84%ED%95%98%EC%9E%90%20-%201.%20%EA%B8%B0%ED%9A%8D%EA%B3%BC%201%EC%B0%A8%20MVP%20%EB%B0%B0%ED%8F%AC)에서 프로젝트에 대한 더 자세한 이야기를 볼 수 있습니다.


> *아이젠하우어 매트릭스: 일의 긴급도와 중요도를 기준으로 업무를 관리할 수 있도록 설계된 우선순위 시각화 다이어그램
> <img width="495" height="300" alt="image" src="https://github.com/user-attachments/assets/144afdee-cd10-4cd6-87c9-05e598a81e3a" />
>
> (사진 출처: https://brunch.co.kr/@chadwick/48)

## 기술 스택
- 언어 & 프레임워크: `Next.js 15`, `React 19`, `TypeScript`
- 상태 관리 라이브러리: `Jotai`, `Tanstack Query`
- UI 라이브러리: `TailwindCSS`, `shadcn/ui`
- 기타 라이브러리: `React Flow`(매트릭스 다이어그램 구현)
- DB/인프라: `Prisma`, `Supabase`
- 호스팅: `Vercel`

## 주요 기능 소개
1. **기본적인 회원가입/로그인/로그아웃 기능**
     
    <img width="1024" height="744" alt="image" src="https://github.com/user-attachments/assets/61c04aa6-b7e6-4e0d-8e97-b78c612f129e" />
    <img width="1024" height="745" alt="image" src="https://github.com/user-attachments/assets/50a1b489-dbaa-4faa-9787-6b806149b45c" />    
    <img width="758" height="380" alt="image" src="https://github.com/user-attachments/assets/a7cd871b-f839-457b-817f-cbf0f8a34c1c" />
    
2. **아이젠하우어 매트릭스 뷰어**
    1. **매트릭스 사분면의 크기조절/중앙 지점의 위치 조정 기능**
        ![resize](https://github.com/user-attachments/assets/4a8d0d3f-7aca-4a3c-9c80-99267b8cee68)

        
    2. **새 업무 생성, 일부 속성을 제외한 수정, 삭제**
        ![create](https://github.com/user-attachments/assets/4bf530db-7346-4c2d-9ec3-fb455be847dc)
        ![edit](https://github.com/user-attachments/assets/8992f23c-de90-46e5-b0b7-f57899c952b3)
        ![delete](https://github.com/user-attachments/assets/7985a038-c6f5-4f3d-94bd-758d2018c0b9)

    3. **당일 작업 중인 일에 대한 표시, 완료한 일에 대한 표시 기능**
        ![stamp](https://github.com/user-attachments/assets/ed1b2b20-5ee8-4fb5-81e2-609ffdffa460)
    4. **특정 날짜의 업무 상황 조회 기능**
    
        ![date](https://github.com/user-attachments/assets/aa781616-1f8e-4da7-aba4-e70d8e1c9456)
        
3. **리스트 뷰어(업무 목록 조회, 일부 속성을 제외한 업무 수정 기능, 업무 삭제 기능 제공)**
    ![list](https://github.com/user-attachments/assets/b341d1e7-5e6e-470d-a2bb-5493ca462acc)

    
4. **업무의 카테고리/하위 카테고리(=스프린트) 생성/수정/삭제**
    ![my](https://github.com/user-attachments/assets/c3f0ae66-24f5-4eea-a48d-2c9a5923937c)

    

> 피드백은 [Github Disscusion 페이지](https://github.com/amaran-th/workaholic/discussions)를 통해 제보받고 있습니다. 감사합니다.
