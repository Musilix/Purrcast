export default function faq() {
  return (
    <>
      <main className="flex flex-col flex-auto flex-wrap justify-center w-1/2 md:w-3/5 max-w-screen-lg space-y-10 *:p-5">
        <section id="splash-intro" className="w-full *:m-0">
          <h1 className="scroll-m-20 border-b pb-4 text-4xl font-extrabold tracking-tight lg:text-5xl break-words">
            What is this?
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
            You may be wondering what Purrcast even is. To describe the goal of Purrcast simply, it's here to serve as a caveman-like weather prediction app, taking
            rolling averages of the amount of cats laying on their heads in your area to determine if it's going to rain soon.
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
            For example, imagine 3 of your friends (or just randos) have posted images of their cats sleeping in your area.
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
            Of those 3 sleepings cats, 2 of them are laying on their heads. This means that there's a 66% - or 2/3 for you math gurus - chance of rain in your area.
          </p>

          <div id="splash-buttons" className="flex flex-row justify-start w-full mt-8 space-x-4">

          </div>
        </section>

        <section id="splash-prev-posts" className="w-full">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            What do I post here?
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
            Pictures of your cat. I feel like you should have been able to figure that out on your own, but I'm not here to judge.
          </p>
        </section>

        <section id="splash-prev-posts" className="w-full">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            What kind of cat pictures?
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
            Although all cat pics are good cat pics, on Purrcast that is a different story. We're looking for a specific type of cat pic.
            That is, pictures of sleeping cats only! If you decide to post a photo on Purrcast to help others devolve back to their monolithic roots, you must make sure your cat is asleep in the photo.
            Otherwise, it will taint the data!
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
            We do have systems in place to try to keep people from posting a photo of a cat if the cat is not asleep in the image, but we are actually legally obligated to tell you that the creator of this site has an IQ less than 96, so we can't put too much trust into that.
            Although the systems are there, please do your due diligence and make sure your cat is asleep in the photo before posting. Please report any photos that are not of sleeping cats.
          </p>

          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-6">
            What do we consider <i>sleeping on it's head</i>?
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
            As already mentioned, the means for us predicting what the weather will be like is solely based on whether a cat is sleeping on it's head or not.
            You may confused as to what we consider a cat sleeping on it's head, so please refer to the examples below for the 3 types of sleeping cats we consider:
          </p>
        </section>
      </main>

    </>
  );
}