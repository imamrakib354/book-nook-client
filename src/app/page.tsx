import Banner from "@/components/Home_Page/Banner";
import HowBorrowingWorks from "@/components/Home_Page/HowBorrowingWorks";
import TopCategories from "@/components/Home_Page/TopCategories";
import NewArrivals from "@/components/Home_Page/NewArrivals";

const Home = () => {
  return (
    <main className="flex-1">
      <Banner />
      <NewArrivals />
      <HowBorrowingWorks />
      <TopCategories />
    </main>
  );
};

export default Home;
