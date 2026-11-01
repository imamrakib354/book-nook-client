import Banner from "@/components/Home_Page/Banner";
import HowBorrowingWorks from "@/components/Home_Page/HowBorrowingWorks";
import TopCategories from "@/components/Home_Page/TopCategories";

const Home = () => {
  return (
    <main className="flex-1">
      <Banner />
      <HowBorrowingWorks />
      <TopCategories />
    </main>
  );
};

export default Home;
