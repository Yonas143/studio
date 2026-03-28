with open('src/app/about/page.tsx', 'r') as f:
    content = f.read()

# Fix Product Design description
old1 = 'description="This category celebrates outstanding excellence in the design, development, and presentation of Ethiopian-made products that embody the nation\'s rich cultural heritage, creativity, and innovation. It recognizes visionary designers, skilled artisans, entrepreneurs, and companies that transform traditional inspiration into modern, high-quality products capable of competing in today\'s dynamic marketplace. The award highlights exceptional achievement in product aesthetics, functionality, packaging, branding, and overall presentation. It places strong emphasis on originality, cultural authenticity, market readiness, and the ability to communicate a compelling story through design. From handcrafted creations to industrial and commercial products, this category showcases how thoughtful design can elevate value, attract global attention, and strengthen Ethiopia\'s creative economy. By honoring excellence in this field, the award promotes the advancement of Made in Ethiopia, encouraging innovation, enhancing competitiveness, and positioning Ethiopian products as distinctive, desirable, and globally relevant."'
new1 = 'description="Honoring excellence in the design, development, and presentation of Ethiopian-made products that fuse cultural heritage with innovation. Recognizes designers, artisans, entrepreneurs, and companies transforming tradition into modern, high-quality, market-ready products. Evaluates aesthetics, functionality, packaging, branding, and storytelling, emphasizing originality, cultural authenticity, and global appeal. Celebrates products that elevate value, boost competitiveness, and position Ethiopia as a hub of distinctive, innovative, and internationally relevant creativity."'

# Fix Acting description
old2 = 'description="The Cultural Discovery Acting Award is dedicated to recognizing and celebrating the extraordinary talent of actors and performers who bring Ethiopia\u2019s rich cultural heritage, traditions, and stories to life. This award honors those who skillfully combine creativity, emotional depth, and technical excellence to portray characters that reflect the country\u2019s diverse cultural identity and historical narratives. Through their performances on stage, screen, or other artistic platforms, awardees not only entertain but also educate and inspire audiences, offering a window into Ethiopia\u2019s timeless traditions, folklore, and contemporary cultural expressions. By bridging the gap between heritage and modern storytelling, these performers play a crucial role in preserving and promoting Ethiopian culture, ensuring that its stories resonate with audiences both locally and internationally."'
new2 = 'description="Recognizes actors and performers who bring Ethiopia\u2019s heritage, traditions, and stories to life with creativity, emotional depth, and technical mastery. Honors performances that educate, inspire, and preserve cultural identity across stage, screen, and artistic platforms. Evaluates the ability to bridge heritage and modern storytelling, enhancing Ethiopia\u2019s visibility locally and globally. Celebrates acting as a tool for cultural exploration, societal impact, and the elevation of Ethiopia\u2019s arts on the world stage."'

# Fix Acting note
old3 = 'note="Note: This category is sensitive \u2014 contestants are required to submit a signed affidavit from their nearest Government Cultural Institution stating that the act fully aligns with the culture it\u2019s presenting."'
new3 = 'note="Note: Contestants must submit a signed affidavit from their nearest Government Cultural Institution confirming cultural authenticity."'

content = content.replace(old1, new1)
content = content.replace(old2, new2)
content = content.replace(old3, new3)

with open('src/app/about/page.tsx', 'w') as f:
    f.write(content)
print('Done')
