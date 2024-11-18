import React, { useState, useEffect } from 'react';
import '../style.css'; // Ensure you have corresponding CSS for styling

const Gift = () => {
    const slides = [
      'https://cdn.igp.com/f_auto,q_auto,t_pnopt32prodlp/banners/birthday_d_igp_banner_20221227.jpg',
      'https://cdn.igp.com/f_auto,q_auto,t_pnopt32prodlp/banners/cakes_d_igp_banner_20220920.jpeg',
      'https://cdn.igp.com/f_auto,q_auto,t_pnopt32prodlp/banners/anniversary_d_igp_banner_20221226.jpg',
      'https://cdn.igp.com/f_auto,q_auto,t_pnopt32prodlp/banners/flowers_d_igp_banner_20220920.jpeg'
    ];
    
    const products = [
        {
          img: "https://i7.fnp.com/images/pr/l/v20221201185803/dates-walnuts-mixed-dry-cake_1.jpg",
          category: "Cake",
          name: "Dates & Walnuts Mixed Dry Cake 500gms",
          price: "Rs.699",
          mrp: "",
          discount: "",
          alt: "Dates & Walnuts Mixed Dry Cake"
        },
        {
          img: "https://i7.fnp.com/images/pr/l/v20221206190637/cyprus-plant-christmas-tree-jolly-pot_1.jpg",
          category: "Plant",
          name: "Cyprus Plant Red Wrapped Pot",
          price: "Rs. 899",
          mrp: "",
          discount: "",
          alt: "Cyprus Plant Red Wrapped Pot"
        },
        {
          img: "https://www.fnp.com/images/pr/l/v20221205192036/graceful-roses-arrangement_1.jpg",
          category: "Bouque",
          name: "Scent Of Love Roses Bouquet",
          price: "Rs.616",
          mrp: "MRP ₹1399",
          discount: "(56% OFF)",
          alt: "Scent Of Love Roses Bouquet"
        },
        {
          img: "https://www.fnp.com/images/pr/l/v20191018140623/alluring-beauty_1.jpg",
          category: "Christy World",
          name: "Alluring beauty",
          price: "Rs.1499",
          mrp: "",
          discount: "",
          alt: "Alluring beauty"
        },
        {
          img: "https://www.fnp.com/images/pr/l/v20221130174854/butterscotch-cake-with-rasmalai_1.jpg",
          category: "Cake",
          name: "Butterscotch Cake With Rasmalai 1kg",
          price: "Rs. 399",
          mrp: "MRP ₹1499",
          discount: "(73% OFF)",
          alt: "Butterscotch Cake With Rasmalai"
        },
        {
          img: "https://www.fnp.com/images/pr/l/v20190109103032/pink-white-roses-choco-cream-cake_1.jpg",
          category: "Cake",
          name: "Pink & White Roses & Choco Cream Cake",
          price: "Rs. 639",
          mrp: "MRP ₹1599",
          discount: "(60% OFF)",
          alt: "Pink & White Roses & Choco Cream Cake"
        },
        {
          img: "https://www.fnp.com/images/pr/l/v20221205202949/red-velvet-fresh-cream-cake_1.jpg",
          category: "Cakes",
          name: "Red Velvet Fresh Cream Cake Half kg",
          price: "Rs. 716",
          mrp: "MRP ₹899",
          discount: "",
          alt: "Red Velvet Fresh Cream Cake"
        },
        {
          img: "https://www.fnp.com/images/pr/l/v20200627195219/3d-moon-lamp-humidifier_1.jpg",
          category: "Gift",
          name: "3D Moon Lamp Humidifier",
          price: "Rs. 454",
          mrp: "MRP ₹1299",
          discount: "(65% OFF)",
          alt: "3D Moon Lamp Humidifier"
        }
      ];

      const gifts = [
        {
          src: 'https://img.freepik.com/free-photo/christmas-valentine-s-day-new-year-portrait-happy-brunette-girl-wearing-warm-sweater-holding-gift-box-isolated-dark-textured-background_613910-18180.jpg?size=626&ext=jpg&uid=R85597136&ga=GA1.2.1386683871.1668942690&semt=sph',
          title: 'GIFTS FOR HER',
        },
        {
          src: 'https://img.freepik.com/free-photo/fathers-day-concept-with-young-daughter_23-2147805463.jpg?size=626&ext=jpg&ga=GA1.1.1386683871.1668942690&semt=ais',
          title: 'GIFTS FOR HIM',
        },
        {
          src: 'https://img.freepik.com/free-photo/four-caucasian-children-wearing-identical-white-shirts-no-socks-sitting-sofa-living-room-impatient-open-boxes-with-new-yeara-s-gifts-smiling-having-joyful-excited-facial-expressions_343059-4404.jpg?size=626&ext=jpg&ga=GA1.1.1386683871.1668942690&semt=ais',
          title: 'GIFTS FOR KIDS',
        },
        {
          src: 'https://img.freepik.com/free-photo/man-close-his-girlfriend-s-eyes-with-hands-wooden-wall_176420-11375.jpg?size=626&ext=jpg&ga=GA1.2.1386683871.1668942690&semt=ais',
          title: 'GIFTS FOR FRIENDS',
        },
        {
          src: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt8prodlp/banners/igp_House_Warming_d_collections_20220309.jpg',
          title: 'HOUSE WARMING',
        },
        {
          src: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt8prodlp/banners/igp_Best_Wishes_d_collections_20220309.jpg',
          title: 'BEST WISHES',
        },
        {
          src: 'https://img.freepik.com/free-vector/realistic-style-happy-birthday-background_52683-20784.jpg?size=626&ext=jpg&uid=R85597136&ga=GA1.2.1386683871.1668942690&semt=sph',
          title: 'BIRTHDAY',
        },
        {
          src: 'https://img.freepik.com/free-vector/pastel-wedding-anniversary-card-vector_53876-77819.jpg?size=626&ext=jpg&uid=R85597136&ga=GA1.2.1386683871.1668942690&semt=sph',
          title: 'ANNIVERSARY',
        },
        {
          src: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt15prodlp/banners/igp_Gourmet_Sweets_d_frames_20220309.jpg',
          title: 'SWEETS',
        },
        {
          src: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt8prodlp/banners/igp_Baby_Shower_d_collections_20220309.jpg',
          title: 'BABY SHOWER',
        },
        {
          src: 'https://img.freepik.com/premium-psd/happy-valentine-s-day-with-3d-hearts-gift-box-romantic-valentine-decorations_106244-1884.jpg?w=900',
          title: "VALENTINE'S DAY",
        },
        {
          src: 'https://www.fnp.com/images/pr/l/v20210129050217/black-forest-cake-pink-carnation-in-fnp-love-sleeve_1.jpg',
          title: 'COMBOS',
        },
      ];

      const categories = [
        {
          imgSrc: 'https://www.fnp.com/assets/images/custom/christmas-2022/gifts/Gift-Hamper_Web.jpg',
          title: 'GIFT HAMPERS',
        },
        {
          imgSrc: 'https://www.fnp.com/images/pr/l/v20221202122959/personalised-secret-santa-matchbox-hamper_1.jpg',
          title: 'PERSONALISED GIFTS',
        },
        {
          imgSrc: 'https://www.fnp.com/assets/images/custom/christmas-2022/gifts/Home-Decor_Web.jpg',
          title: 'HOME DECORATION',
        },
        {
          imgSrc: 'https://www.fnp.com/images/pr/l/v20210203175959/exotic-red-roses-arrangement_1.jpg',
          title: 'BOUQUE',
        },
        {
          imgSrc: 'https://www.fnp.com/images/pr/l/v20221208160105/xmas-special-chocolate-hamper_2.jpg',
          title: 'CHOCOLATES',
        },
        {
          imgSrc: 'https://www.fnp.com/images/pr/l/v20221201185702/mixed-fruit-delicious-dry-cake_1.jpg',
          title: 'CAKES',
        },
        {
          imgSrc: 'https://www.fnp.com/images/pr/l/v20211029125948/syngonium-jade-plant-set_1.jpg',
          title: 'PLANTS',
        },
        {
          imgSrc: 'https://www.fnp.com/images/pr/l/v20210129050217/black-forest-cake-pink-carnation-in-fnp-love-sleeve_1.jpg',
          title: 'COMBOS',
        },
      ];

      const banners = [
        {
          imgSrc: 'https://i1.fnp.com/assets/images/custom/new-desk-home/hero-banners/Desk-cakes.jpg',
        },
        {
          imgSrc: 'https://i1.fnp.com/assets/images/custom/new-desk-home/hero-banners/Desk-same-day.jpg',
        },
        {
          imgSrc: 'https://i1.fnp.com/assets/images/custom/new-desk-home/hero-banners/Desk-offers.jpg',
        },
      ];
    const [currentSlide, setCurrentSlide] = useState(0);
  
    useEffect(() => {
      const updateSlide = () => {
        setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
      };
  
      const intervalId = setInterval(updateSlide, 2000);
  
      return () => clearInterval(intervalId);
    }, [slides.length]);
  
    return (
      <div>
        {/* Slider Section */}
        <div className="slider">
          <div id="img">
            <img src={slides[currentSlide]} alt="Slider" />
          </div>
        </div>
  
      {/* Gender Section */}
      <section id="gender">
        <div className="pro-container">
          <div className="pro">
            <a href="bouque.html"><img src="data:image/png;base64,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" alt="Bouque" /></a>
            <div className="des">
              <span>BOUQUE</span>
            </div>
          </div>
          <div className="pro">
            <a href="aroma.html"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAW1klEQVR4nO2deXiU1b3HP+edLclMMllnyDIkQNgEFCmI4sIiCoqttKIFlbYWq21ve623rdpab6+3vZUqVu0qirWtomi99qJYhKoILiBiWINhJ8lkyL5MJsls73vuHxMTskySmcwA7TOf5+EB5pzzO2fe73v23zkDCRIkSJAgQYIECRIkSJAgQYIECcIgznYB/tlp2JTnMOjkYxKuBpDwtqKI+9LmuQ5FYy8hSIS0vJX7AaBZ55+6vGFTnkOvk3uAzF7RmoKquCBrgasyUvv6mJQyzpSWSmN6enCGpsnzhGA8yAnASMAMZHT+DdAGNHX+XS4lZSAOK4oobW7W75o0SfhjUBwNkACdNaO3GAAZBh2PAjdFavycrSEul2+iqnI9MFcILgNShmmyTQje1zS26HSsz8szlQ23jC1v5bqB1DDBbuv8U9ZIbZ5TgrhcMltVfcuEEMuBGXHObqcQ8jkpTS8WFIiGaAwMLIhosc53pUdqU4mmILHmxAnPiKoq30pN85cLIX5N/MUAuEhK8RvwVzmd3tVVVe2OSA1IeDtsoGBTNIU6qzWkurrVpqqGn0spvgoYz2ZZAD/IZ3U60wO5uaJuKAnc7+SNl5rcTqgfO52GoE6ZmjW3yhlpIc5KDZFSKk6n/yvBoKFUSvENzr4YAEYQd6qq/3BlpfcuKaVusARp81yHgqq4QCD+CrgBN0K8HK0YcBZqSGWlt1gIsRa46EznHSE7VFXeUliYdPxMZnpGa0hlpe+LQoiPOffFALhYUcTuqirfl89kpmekhkgpdS5X4DEp5XfPRH6nowYDHC87wLH9O5hz/VfY9vpfEIHWULkMqVzx+a+wbcNaRp03g9ETJqPTG/qxIh7Pzzd8Xwihxbu8cRektFQarVb/c0QxSRouxw/u46M3VnPxBUUoOonbMoPK0ve59doJADz/9zIcky4jzfMxUlPYvucEMxfdyejzzu9jS0r+Lxg0Lhs1SngHy3flyjcXgViNQCK54777Fmwcapnj2mTV1clUqzWwkbMgBoDdUUhBbhafO7+IKRMKqSgr6ROn/NNPmDJ+JNOmFJI/IhNbwch+bQnBYoMhsKGuToabCJ4e+UkE+UCBEKyOpMxxE6S0VBq9Xv8rIOfFK4/BMKdaaWkP/VuvU9D8rX3iyEAren1oQOXuEFjSBprLySt9vsD6I0ekKQ7FBeIkiJRSsVr9zwsRWgE9m0h9ClKTAKToAng7ulscX4eXFH0wFE9KhHHwlx/k3KQk/7oBh8WSOwCngEpNyDsiKW9cFhddrsDjwI3xsB0peWPOp6LqOIUOOxPHZLFm7btww1QAyk+Wc9N10wCocNYyYtSkIdkUgsVVVYFHgP/oL7yzz4h45g9xqCFOp+/GszGaCsfY82dy4Gho4j1+dC4+X3tXmILKuNG5AOw/UkfxlEhG4/Luykrfl2JZ1lCZYkhFhXcM8HQsbQ6XtIwsGlpDo1WDQU9RQU5X2NxZEzAaQo1Eo0fDmpkdkW0heKa83Ds6dqWNoSBSSkVRxAtAxEvO8UZTkpEy1I8UOboFmX3JeV3/Foah9B99SNfpxPNSypg9x5gZcrkC3+QcnYHbi87DVdMIQJHD3ifceaqebMf4aM1f4nQGVkRfup7ERJDq6lablPLnsbAVD8ZNvYQDh2vChh84XEvx+TOjti+EXHnqlMwZPObgxEQQVTX8nL5L0OcMGdl2apoDAJys7CtMbUuALNuIiGympenIyzOSlqYDyFRV33/FoKjDXzpxOtsLQHeMc2MJHYAnf3Evu7Zt7uo3IkUIwYzZC7jzRyvDxsnLMyIESAkulx/AJ6U6xuFIqYqu1CGGPQ8RQn+PlPKcEQNg13v/wFb0OdLt0Q2AmmuO8/G2zQMK4vGoWCw6PB71s49MQui/T5i5yVAZliAul8zWNH/MOrRYITWNdPto8sbNitpGzYldA4a73Sput9rrU3mH0yn/J9o9ehhmH6KqvmUM3xvkXwmzEIFh7Z8MS5BO75AEpyGlHNYzibrJcrl8EzXtjHiHRIxQFJprot95ba45jlCiflcvrqryjs/PT4rKlTRqQTSNxdGmjTczrriaj7dtHrQfCIdQFGbOWTCcInwBeCSqvKPN0en0bwZ5VbTpzxQrFkyl4GvfIHvOfJAS8adfcu2FoWWSN3a74Wv3gRDUv/sWzj89zTOb9sQi240FBaZro0kYVQ0pLZVG8Ec/hAnD4f0lbHltHUdKd9Ha4ibVamXs5OnM+8JSxk6+MNbZxZMrSkulMRpf4qgESU8PTpeyy8F52Kiqygu/e4h333iFQoeZqy+1kJk+gsbmADt2v8/K729i7udvYtm37kWnG9RdKixeVxVj0roni/kWjWOnqkjKK4jF1zgds9UamAbsiDRhVIJIKSdHky4cL/zuId7f9Crfua2ABXOyEac1pLfeABu31PPUc6+E/v+dHw/Zrt8X2h3UmZIACJR+whh79+5rcV4KZaUlJOUVoDOZutIYO+MPByGYRBSCRDuUiHpptDeH93/Cu2+8wjeX57Fwbk8xAISAa+dlc8fyPLa8/jJHSncPya7P28H6v/weoehIKR4LgK7OSaqlWxCL2YhSEzrCYR4zDqHoWP/cH7qEHA6aJqN6RlGOsqLLrD+2vPYShQ4zC+YMvDl0zZwsNrzVyJbXXmLspFB/0tHmYcMLT/HR1k0019f2WbsSikL+sq9gygktuSf7PYClR5wknxsAo81O3tJb2bTued7865972hGC9GwbM+cs5PM330FSyuCtdegcS+REO+zt31cmCo6U7uKqWZY+NaM3QhHMvDCVtz78GAiJ8dAPbqPaWU7GpbMpcIxEnjZ30JmSSCke2yWGr6aaQkvvpY5QP1JRW4PRZifn6muxTv0cbccOo/p83XlrGh2VFfxj/YscKNnOj1Y9OxRRCof0AHoRrSBpUabrQ6u7lQxr302j/si0Gmh1hzaaNrzwFNXOcorv/xnJhUWDpg0cLKHY3tN759DRBkaPSOFIaQlG2zVAqKYYbf2XJ2v2lRz9xX+y4cWnWbLiewPmJ2V0zyjaPiSi/U5NUzl6cA/vvfk33nvzVQ7v/wRVDbnfpGdm0tgS6BG/vUPl6Ml22jt6vtHN7gDW9JDf1IdbNmIeN5G2E0dp2vEB/vpBThBUHcea1rOzrq33kGFNRjl1ckjfI7loFBmzrmDHu4Mf/RBiCA51/RBtDbEMHiXEjnf+zqvPPk5DbW2Pz7NybCy48TZS07OoqT3V9fmHW5s5urmdQk8SH1paKL46hVmzQ9v01XV+dAYzf1z1AK2NdciGOtwH9gKhdj5tygXk3XIbJnvfzabkQFufYtuyQ/9P6seBLhzJIwtxbntnCDHFGRVkSLz89K/Y9MpfmD41nR/cXszowmQUISh3dvDGWw289OTDqJrENyK0YNzeoXJ0cztfbM8BBaa1p/K3zXVcONNCcpKOY+V+al1NaL56vr40j4unWbHlmGho9LP7QCsvvFbG0Qfvo+j7P8Y8ZlxXOfyNDeQlB8OW02YKcKqhHmPW4F4nUlGQWvx8rqMVxEP/p0+72P72Bja98heWL8nly1/o2SZPKDYzodjMLV8awZoXXXxU0ozbE6S23k9RW1KPBZ3pvjRaWkMP093q4/ab81l0ZTYGQ3ckW7aRBXOyuHRGOj/+5QkqnniYcQ89js4cqgG+0hKK7X330GrrPYwvzqLYbqT84F6Ml18Z5ePoDzn0anca0fYhA2amqiqvPvtrLpqa3keM0xlhM/KTu4r473vG0NISJM9uwpncc7Wh3OzFnm1Ck/DUIxNZvDCnhxinYzHreOB7hWgd7dRufL3rc1FxlMz08Ns2WRkpUHlkoK8UMVKKqASJtoa4Bwo8XraPxrpalnyzeEAjh4+00+ZRmTo1tWvY67VrqOWgAzQkNVl+hABzcmjJpGR3K+YUhXHjzP0OlXMyDcydlc627VuxTJwMmqTtcBk7OkKCNDZ3kJmeHMr/eGOXo7Wnsh25fx8oIaPJjkICjQ0E2zxdts3jhj61EGLgZxSOaAWpAKaEC3SdPIZOEYwfE77vP/ZmO1WbvGSrBjrOV2mcHaRgrImLF1rZvbqV6aSyW7Qx46rQ6LH5VBDjRoF+D1Tr/GwtaGbF3fno+qnjE8ea2bytgpfLj5LS0sIM3Qj2tmSi+tpxNznJEKFhcqO3BW+tDZ0pBZ+ukS0HSmjLDLXErYF2ktxuDB0dAKTW1rCov8zCUx5J5M+IUhBRBnJRuFBNUxFCoCDpb4W//LCXnLcN2DCADtRSjZNl7bwzrpGlt9n5ILuJ6fWpHMlq47Kx+axdU01hmYkLVAujdEmMArIr9Wx7p5G58/t2ZYoCSGgqKsS+5wBF19yJIcVKddn7NNZaGHnF1wGo2/YMyfYJjBh/KcF2NwcPv07FqFFddvwp3c2cjEwMQrdIRE5UfYiUDLgbZssvJKhqVLj6XxP68MNmtF6DngtUC7M/tfL0She6PIX9QQ/JI3WsXulk5oFULlB71jaHSKK6sv/V7ePlHahWC6reQLrHhyElNGyurz+Jaug+sqYajDQ0hF5kfUoamW2+fu1Fg6KIqHYMoxJEUUTpQOHjp0zDkpbKhrf6d76YPN1CST99XiYGbm6003FQZU2gmsZ9AZY12LGLviOkPUorE6f2bRLbOlTe/rAZ59iJAKTSLUCr0nfpxC27RT097nCRkoPRpIuqyWpu1u+yWv1t0P+eiN5gZNGyO3n56Ue5cLKFWdN7nkqaMtnChll1vLanAbNfoUUfBDPozIIGNcinJzyomsbBjjb+XHSKHL0RtU1CO1iDetr1KpYL9FxxYU9BVA1+9VQlrQHByUsuwdTaSobFBoAM+nHrJRm9NHEbQQv6UfRGMiw5JHla8VqimtOdjqe62vBJNAkjFkTuXOoIem9+TPoMJoQOv/E8Ws03oep7zo7nL17G8U/3svK3b7N4QRuLr7GRmd79Bl63JAf/9RqeNpV0qx4h4c0NDbAT7tUXscpUzt3BAnY2tJI2Q8+ixdlIAU3NQVItOoyG7sotJXx6pI01605x5Hg7u29Ygjc1DWt1Ne7aE9Qc2oFR0ePKyyGjsrFHOV25ObSc2IdfC+KuPYmpwBgLQbZNny4Cg0frS0R76nLnUkdQL/Yge04KNWGmMetnqLqeHaymqfx93R/Z+NIzeL1e7DkpjB5pxJZtwJ5j5LKL0slMN1Be7uX152u5vD6d0SRTQiv+xRKxHmbKNCqlj4K5yaQt0oEe9pd5OHiojdoGP1U1AY6dbKejI4g3J4u911xHc0H34SUhJam1dThOVlB24flMKTlAhhoa6jbpVPZPm8yE3fuoLBpJqy0HGWbZOfvECZaOGk+Hq3LQvXch5A/z85NWRfJsPyOiGhLUicd6iwGgyDYsnhdpsf5bz88VHdfd/A3mXb+U/Tvf58ShA7zz2kuoapAvX28nw2pgT4mHspc9LPeNQOl8PypTfNw0y866f9RAGziECd7VeHNnM7bFBkaNS2HNWhfHyttJys0n/ar5VLkq+fiqq+k9OZFC4LbbKLWHmq49F0/r871KZ04f9Ls76upIuuxKvM7yobgIvT5YhHBE2mSFPcRp8h8ImyjFnMpFcxZyaN8upNT47tcdLJiTBUDJJjc3+np68uc6jBgNCppVhq4i6+TS9jRe2VzLtBlprLy/mId+e5K9n9ZimTCJsTk2Art24czOQg6h4vstZlpzbJgbG0hq6TuHk4qgaWQh5qYmxh49ynmjitGZzXRUlJOeM+B2wfZofbIghouLUg78EN5Y9wzb3nyVu253MP+y7kqm72ekOXt26GSDMVMhUCUxnPbW63ydM+kkhQfuGsXPnjjBvid+ydgHHyZv2kV4neVowb6jqd4YrFaSCkbiq3bhb+g7GhSKwDL2PPzNTeimTEdnNtN+8jiNH2xl4ZcGck4Uzw2a+QBEKsjb0L+DnN8U3u+huaGO19eu5sZFth5iAMhsaGtWMYtQu15qamNmcWhUdul8K1vLmpkfDAnULlXUnG5xDAbB/f8+im/9qIzy3/+KzHlDd27z1dXgOXp4wDjemmqgc8ewopzGD7aSN3I0i5bdHi5Jm5SGl4ZciH6ISBBV092nU9TZ9DqcoykWPKnLwqbbuXUTCpIbrrP1CbtxhZ21q6sx1AkCesmoS5IQBqiu81FYmMyxq728+H4NpqCCL0ty84qeozmTUbBkUQ5/+HMFzj/F57ypUBTSc+ws/NJyFi1dQVJyuIVK8aTDIRrDBA4tr0gTdI60HkWyAEATSVubsn+xMKhkhp1VrXn4JzRXbOORB8Kf19CkROlsmiqcXp54poJHf9q9pyE1iVD6L26ly8e37vuUe1etYdyUwTvoOOHTtODokSPNruEYibgPERetq6TX3SVO5x+eBO4MlyYQ8JFkGlh75bR+4n831nHoWDsHyjxMnhCa/IUTA8BkCo16Av5YXDoaHVKKp4crBsTsFK7pfpD14UKzbbk4q4f2sKpr/Wzd3oRep+fF9bWDJwCcp0JrZhk5uUOKHwcadDrDg7EwFBNBQieGlAfChU+efhl19R3sLfWEi9LFM+tOkZaRxe33/oK9pW4+Khl8W+Ht95rIseeS6xjc+yQeCCHuycsTYV/ISIjZOfX8fMNThHGdnDB1BmMmTuJ3f67C3Rp+b3vbR81s39XEkhV3M2P21UyeNpOn1p6iqSV8mg93NbNtRxPXLrsdMZhzV1yQH+TlGZ6NlbWYCSKE0BRFWwr0GWUIIbj9npW0eU384GfH+Hhvz7fe69NYt76aXz1ZwcXzruWiOSEfqVvv+k/80swPf36MPQd6rg53eFVe+Fs1D/++gumXz+fyhTG/dmQoNOv1crkQIrrjvv0Q81fK6fQtAf7aX1hNVQVPr7yHE4fLyMo0UZhnwh+EoyfaCQYlC278Gou/+m0UpdvDve6Ukz+uup/DB/aSk51MUb6RFk+QyiofPr/G/C/ewpIV3xuWV3yUSCm5weEw/S2WRuNSx51O/2Mg+3Xtk5pGackO9u3cRn21i2SzhfyiYmbOuYYse/+dspSSQ/t2sWf7u9RVO9HrDTjGTGDm3IXkjIj5UYIhISWrHA7TD2NtNy6CSCmVqir/i5ylq/3OAOvy8423qJ8su0YKsRqJFIp2h37aS0O+WzEccblRTgihtbQYl4sor9s+txFbOjqMXxNCaBLxJJCPoECTSkR3K4YjbncuTpok/Eaj8UYQ4e9H/6dDvGU0Gr4wdqyI3eZ7L+J6K2lOjmhtaTFcC6yLZz5niFcDAcPnbTbRNZkSinYHEqeESgER3a0YjjN1kbJSVRVYBfLuM5FfjJFS8mhBgfHef4mLlE+nqsp3vZQ8yzl8ldPpSIlbCG4vKDD1O4yPB2d8altd3TEqGFTWApec6bwjQ36g08lbc3OTh3Z4JEacld8PkVKKqqrActBWgYjJTWwxpElK+WBBgek3Z6KJ6s1Z/UGX0PVOvgdBrADidlv0EPFKKdaA4afD3WQaDufEb1BVV7faAgHjt4G7hYjd+cUh0iaEeEbTgg8P9za4WHBOCPIZlZUyU1F8y6QUtwIXxzm77UKI5zXNsO5s1ojexFWQ4fxsg9PpHScE14OYJyWXEcG5xjB4gPeEkO9oGusdjqTYntCJEfH9YUnRubQAdP5sw5DPtxcUJB0mdMXRI7t2ScOIEcHpUspJIMd1HsovJHQaOJ1usTxAM6ETXuVSckhRxCEpKc3PN+wSQoTfWDlH+Kf4pc9OP9ntnX/+pYnvb1AN42cbEiRIkCBBggQJEiRIkCBBggQJEiToxf8DTPNmxbx2IIwAAAAASUVORK5CYII=" alt="Aroma" /></a>
            <div className="des">
              <span>AROMA</span>
            </div>
          </div>
          <div className="pro">
            <a href="gifts.html"><img src="data:image/png;base64,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" alt="Gifts" /></a>
            <div className="des">
              <span>GIFTS</span>
            </div>
          </div>
          <div className="pro">
            <a href="cakes.html"><img src="data:image/png;base64,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" alt="Cakes" /></a>
            <div className="des">
              <span>CAKES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="p1" className="section-p1">
      <h2>Featured Products</h2>
      <p>Christmas Special</p>
      <div className="pro-container">
        {products.map((product, index) => (
          <div className="pro" key={index}>
            <img src={product.img} alt={product.alt} />
            <div className="des">
              <span>{product.category}</span>
              <h5>{product.name}</h5>
              <div className="star">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p>Selling Price {product.price}</p>
              {product.mrp && <h4>{product.mrp}{product.discount && `(${product.discount})`}</h4>}
              <h5>(Incl. of all taxes)</h5>
            </div>
            <div className="cart">♡</div>
          </div>
        ))}
      </div>
    </section>

      {/* Gift Banner Section */}
      <section id="giftbanner" className="section-m1">
        <div className="top"></div>
      </section>

      {/* Occasions Section */}
      <div style={{ textAlign: 'center' }}>
      <h2>OCCASIONS</h2>
      {/* Categories Section */}
      <section id="p1" className="section-p1">
      <div
        className="pro-container"
        style={{
          columns: 4,
          margin: '10px',
          paddingLeft: '20px',
          paddingRight: '0px',
          textAlign: 'center',
        }}
      >
        {gifts.map((gift, index) => (
          <div className="pro" style={{ height: '80%' }} key={index}>
            <img src={gift.src} alt={gift.title}  />
            <div className="des" style={{ textAlign: 'center' }}>
              <h5>{gift.title}</h5>
            </div>
          </div>
        ))}
      </div>
    </section>
</div>
    <section
      id="hero"
      style={{
        backgroundImage: "url('https://www.fnp.com/assets/images/custom/new-desk-home/offer-banners/New-arrival-gift-1-desk-8-sept-2022.jpg')",
        width: '100%',
        height: '80px',
        border: '5px solid white',
        margin: '20px 0',
      }}
    >
    </section>

    <section id="p1" className="section-p1">
      <h2>CATEGORIES</h2>
      <div className="pro-container">
        {categories.map((category, index) => (
          <div className="pro" style={{ height: '80%' }} key={index}>
            <img src={category.imgSrc} alt={category.title} />
            <div className="des" style={{ textAlign: 'center' }}>
              <h5>{category.title}</h5>
            </div>
          </div>
        ))}
      </div>
    </section>

      {/* Deals Section */}
      <section id="deals">
        <div className="banner-box1" style={{ width: '48%', backgroundImage: 'url(https://www.fnp.com/assets/images/custom/christmas-2022/middle-banner/Secret-santa-gifts_Web-new-9-dec-2022.jpg)' }}>
          <button>Learn More</button>
        </div>
        <div className="banner-box1" style={{ width: '48%', backgroundImage: 'url(https://www.fnp.com/assets/images/custom/christmas-2022/middle-banner/Christmas-Decoration_Web-new-9-dec-2022.jpg)' }}>
          <button>Learn More</button>
        </div>
      </section>
      <section id="deals2">
      {banners.map((banner, index) => (
        <div
          key={index}
          className='banner-box1'
          style={{
            backgroundImage: `url(${banner.imgSrc})`
          }}
        />
      ))}
    </section>
    </div>
  );
};

export default Gift;
