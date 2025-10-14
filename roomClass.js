

// DATA FOR CLASSES

let historicalPersons = [
    {
        century: `1600s`,
        name: `Sor Juana Inés de la Cruz`,
        lifespan: `(1648-1695)`,
        image: `../images/portraits/Sor_Juana_Inés_de_la_Cruz.jpg`,
        bio: `She was a Mexican writer, philosopher, composer, and nun. Sor Juana is considered one of the most important figures of the Latin American colonial period and the Hispanic Baroque.`,
        notableWork: `../images/notableWorks/Sor_Juana_Inés_de_la_Cruz_manuscript.jpeg`,
        descriptionOfWork: `She was a prolific writer known for her poetry, plays, and prose, often addressing themes of feminism, religion, and society.`,
        traits: [`writer`, `philosopher`]
    },
    {
        century: `1600s`,
        name: `Isaac Newton`,
        lifespan: `(1643-1727)`,
        image: `../images/portraits/Isaac_Newton.jpg`,
        bio: `As English mathematician, physicist, astronomer, alchemist, theologian, and author, Newton is widely recognized as one of the most influential scientists of all time and a key figure in the scientific revolution.`,
        notableWork: `../images/notableWorks/Isaac_Newton_mathematica.jpeg`,
        descriptionOfWork: `His book "Philosophiæ Naturalis Principia Mathematica" laid the foundations of classical mechanics.`,
        traits: [`scientist`, `mathematician`]

    },
    {
        century: `1600s`,
        name: `Shah Abbas I`,
        lifespan: `(1571-1629)`,
        image: `../images/portraits/Shah_Abbas_I.jpg`,
        bio: `Shah Abbas I revitalized the Safavid dynasty, transforming Persia into a major power. His notable achievements include modernizing the military, revitalizing the economy, and fostering a flourishing cultural environment in the capital city of Isfahan, exemplified by the construction of the magnificent Imam Square.`,
        notableWork: `../images/notableWorks/Shah_Abbas_I_isfahan.jpg`,
        descriptionOfWork: `Under his guidance, Isfahan rapidly became one of the most beautiful cities in the world.`,
        traits: [`head of state`, `military leader`]
    },
    {
        century: `1600s`,
        name: `Queen Nzinga`,
        lifespan: `(1583-1663)`,
        image: `../images/portraits/Queen_Nzinga.jpg`,
        bio: `Queen Nzinga was a fearless leader of the Ndongo and Matamba kingdoms, renowned for her fierce resistance against Portuguese colonization in Angola. She skillfully employed diplomacy and military tactics to protect her people and maintain her nation's sovereignty.`,
        notableWork: `../images/notableWorks/Queen_Nzinga_illustration.jpeg`,
        descriptionOfWork: `Queen Nzinga was a highly skilled negotiator and diplomat who fostered unity through inclusive leadership, welcoming runaway slaves and soldiers into her kingdom, which not only strengthened her forces but also weakened her enemies.`,
        traits: [`head of state`, `activist`, `military leader`]
    },
    {
        century: `1600s`,
        name: `Tokugawa Ieyasu`,
        lifespan: `(1543-1616)`,
        image: `../images/portraits/Tokugawa_Ieyasu.jpg`,
        bio: `Tokugawa Ieyasu was the founder and first shogun of the Tokugawa Shogunate of Japan, ushering in the Edo period, an era of peace and stability lasting over 250 years. His legacy includes establishing a centralized government and implementing policies that fostered economic growth and cultural development.`,
        notableWork: `../images/notableWorks/Tokugawa_Ieyasu_edo.jpg`,
        descriptionOfWork: `Despite isolation, Japan experienced significant economic growth, urbanization, and cultural development. The period saw advancements in agriculture, the rise of merchant class wealth, and a flourishing of arts and literature, including kabuki theater and ukiyo-e woodblock prints.`,
        traits: [`head of state`, `military leader`]
    },
    {
        century: `1700s`,
        name: `Voltaire`,
        lifespan: `(1694-1778)`,
        image: `../images/portraits/Voltaire.jpg`,
        bio: `Voltaire was a French Enlightenment writer, historian, and philosopher famous for his wit, satire, and advocacy of civil liberties. Although only a few of his works are still read, he continues to be held in worldwide repute as a courageous crusader against tyranny, bigotry, and cruelty.`,
        notableWork: `../images/notableWorks/Voltaire_candide.png`,
        descriptionOfWork: `His most famous work, the satirical novella "Candide," criticizes optimism and explores themes of human suffering and the abuse of power.`,
        traits: [`writer`, `philosopher`, `activist`]
    },
    {
        century: `1700s`,
        name: `George Washington`,
        lifespan: `(1732-1799)`,
        image: `../images/portraits/George_Washington.jpg`,
        bio: `He was a military leader, statesman, and Founding Father who served as the first President of the United States. His "Farewell Address" warned against political factions and foreign entanglements, becoming a significant document in American political thought.`,
        notableWork: `../images/notableWorks/George_Washington_river.jpeg`,
        descriptionOfWork: `His leadership during the American Revolutionary War was instrumental in securing independence from Great Britain.`,
        traits: [`head of state`, `military leader`]
    },
    {
        century: `1700s`,
        name: `Wang Zhenyi`,
        lifespan: `(1768-1797)`,
        image: `../images/portraits/Wang_Zhenyi.jpg`,
        bio: `As Chinese astronomer, mathematician, and poet, Wang Zhenyi made significant contributions to the understanding of lunar and solar eclipses. She also wrote influential works on mathematics and poetry.`,
        notableWork: `../images/notableWorks/Wang_Zhenyi_astronomy.jpeg`,
        descriptionOfWork: `Her most notable work, "The Simple Principles of Calculation," simplified complex mathematical concepts for a wider audience.`,
        traits: [`scientist`, `mathematician`, `writer`]
    },
    {
        century: `1700s`,
        name: `Ibrahim Muteferrika`,
        lifespan: `(1674-1745)`,
        image: `../images/portraits/Ibrahim_Muteferrika.jpg`,
        bio: `As an Ottoman diplomat, historian, and printer, Muteferrika is most notable for establishing the first printing press in the Ottoman Empire that used Arabic script. This helped spread knowledge and literature throughout the empire.`,
        notableWork: `../images/notableWorks/Ibrahim_Muteferrika_press.jpg`,
        descriptionOfWork: `The first book ever published by Muteferrika is "Vankulu Lügati", a 2-volume Arabic-Turkish dictionary.`,
        traits: [`writer`, `innovator`]
    },
    {
        century: `1700s`,
        name: `Anton Wilhelm Amo`,
        lifespan: `(1703-1759)`,
        image: `../images/portraits/Anton_Wilhelm_Amo.jpg`,
        bio: `He was a Ghanaian-German philosopher who became the first African to earn a doctorate in philosophy in Europe. While teaching at German universities, he contributed significantly to the Enlightenment, focusing on epistemology, metaphysics, and the philosophy of mind.`,
        notableWork: `../images/notableWorks/Anton_Wilhelm_Amo_dissertatio.jpg`,
        descriptionOfWork: `"Treatise on the Art of Philosophizing Soberly and Accurately" (1738): This work examined the principles of logic and scientific method, advocating for clear and rational thinking.`,
        traits: [`philosopher`, `writer`]
    },
    {
        century: `1800s`,
        name: `Napoleon Bonaparte`,
        lifespan: `(1769-1821)`,
        image: `../images/portraits/Napoleon_Bonaparte.jpg`,
        bio: `He was a French military and political leader who rose to prominence during the French Revolution and led successful campaigns during the Revolutionary Wars. Napoleon is best known for his Napoleonic Code, a comprehensive legal system that influenced civil law worldwide. After a disastrous invasion of Russia and subsequent defeats, he was exiled to the island of Elba. Napoleon briefly returned to power in 1815 during the Hundred Days, only to be defeated at the Battle of Waterloo and exiled again to the remote island of Saint Helena, where he died.`,
        notableWork: `../images/notableWorks/Napoleon_Bonaparte_coronation.jpeg`,
        descriptionOfWork: `Napoleon rapidly advanced through the military ranks due to his brilliance in strategy and leadership. In 1799, he staged a coup d'état and became the First Consul of France, later crowning himself Emperor in 1804.`,
        traits: [`head of state`, `military leader`]
    },
    {
        century: `1800s`,
        name: `Bahá'u'lláh`,
        lifespan: `(1817-1892)`,
        image: `../images/portraits/Bahá'u'lláh.jpg`,
        bio: `He was the founder of the Baháʼí Faith, a religion emphasizing the spiritual unity of all humankind. Bahá'u'lláh endured 40 years of exile and imprisonment, facing persecution from both religious and political authorities. Despite His hardships, Bahá'u'lláh wrote prolifically outlining his teachings. These writings address a wide range of topics, including the oneness of God, the oneness of religion, the oneness of humanity, universal education and world peace.`,
        notableWork: `../images/notableWorks/Bahaullah_revelation.jpeg`,
        descriptionOfWork: `Bahá'u'lláh is revered for his writings, collectively known as the "Most Holy Book," which outline the principles and teachings of the Baháʼí Faith.`,
        traits: [`philosopher`, `writer`, `activist`]
    },
    {
        century: `1800s`,
        name: `Simón Bolívar`,
        lifespan: `(1783-1830)`,
        image: `../images/portraits/Simón_Bolívar.png`,
        bio: `Bolívar was a Venezuelan military and political leader who played a leading role in the establishment of several independent nations in South America, including Venezuela, Colombia, Ecuador, Peru, and Bolivia. He advocated for social reforms, including the abolition of slavery and the promotion of education. He believed that true independence and progress could only be achieved through a just and equitable society.`,
        notableWork: `../images/notableWorks/Simon_Bolivar_letter.jpg`,
        descriptionOfWork: `His "Jamaica Letter" outlined his vision for a unified and independent South America, free from Spanish colonial rule.`,
        traits: [`head of state`, `military leader`, `activist`]
    },
    {
        century: `1800s`,
        name: `Liu Mingchuan`,
        lifespan: `(1836-1896)`,
        image: `../images/portraits/Liu_Mingchuan.jpg`,
        bio: `He was a prominent Chinese general and statesman during the late Qing dynasty. He is best known for his efforts to modernize China's military and infrastructure, particularly in Taiwan. His accomplishments included reform of the administrative structure of Taiwan, improving efficiency and governance. Liu Mingchuan not only established schools to promote education and literacy, emphasizing the importance of modern knowledge and technical skills, but also encouraged the cultivation of cash crops such as tea and sugar, which became significant exports for Taiwan.`,
        notableWork: `../images/notableWorks/Liu_Mingchuan_taiwan.jpg`,
        descriptionOfWork: `His tenure as governor left a lasting impact on Taiwan, laying the groundwork for its modernization and development.`,
        traits: [`head of state`, `military leader`, `innovator`]
    },
    {
        century: `1800s`,
        name: `Ada Lovelace`,
        lifespan: `(1815-1852)`,
        image: `../images/portraits/Ada_Lovelace.png`,
        bio: `She was an English mathematician and writer, considered the first computer programmer. Her insights extended beyond mere calculation; she foresaw the machine's potential for more complex tasks, such as composing music and creating graphics, long before the advent of modern computers. Lovelace's work, though not fully recognized in her lifetime, has cemented her legacy as a pioneering figure in computing as well as a visionary thinker.`,
        notableWork: `../images/notableWorks/Ada_Lovelace_machine.jpeg`,
        descriptionOfWork: `Ada Lovelace is most famous for her work on Charles Babbage's proposed mechanical general-purpose computer, the Analytical Engine. She wrote the first algorithm intended to be carried out by such a machine.`,
        traits: [`scientist`, `mathematician`, `writer`, `innovator`]
    },
    {
        century: `1900s`,
        name: `Albert Einstein`,
        lifespan: `(1879-1955)`,
        image: `../images/portraits/Albert_Einstein.jpg`,
        bio: `He was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics. His scientific discoveries includes the photoelectric effect, which is the emission of electrons from a metal when light shines on it as well as explaining of Brownian motion (the random movement of particles suspended in a fluid) which provided empirical evidence for the existence of atoms and molecules. His work on the photoelectric effect earned him the Nobel Prize in Physics in 1921 and laid the foundation for quantum theory.`,
        notableWork: `../images/notableWorks/Albert_Einstein_relativity.jpg`,
        descriptionOfWork: `Einstein is best known for his mass–energy equivalence formula E=mc², the world's most famous equation.`,
        traits: [`scientist`, `mathematician`, `writer`]
    },
    {
        century: `1900s`,
        name: `Lech Wałęsa`,
        lifespan: `(1943-)`,
        image: `../images/portraits/Lech_Walesa.jpg`,
        bio: `Lech Wałęsa is a prominent figure in modern European history, celebrated for his role as a trade union leader and politician. He began his career as an electrician, but rose to prominence during the Gdansk shipyard strikes of 1980, advocating for workers' rights and social justice. Wałęsa gained international prominence as the charismatic leader of the Solidarity movement, which played a pivotal role in the downfall of communism in Poland and across Eastern Europe.`,
        notableWork: `../images/notableWorks/Lech_Walesa_rally.jpeg`,
        descriptionOfWork: `Wałęsa played a crucial role in the subsequent transition to democracy in Poland and was elected as the country's first democratically elected president in 1990. His life story reflects a commitment to the values of solidarity, democracy, and the peaceful pursuit of political change, making him a symbol of resistance against authoritarianism and an inspiration to people around the world.`,
        traits: [`activist`, `head of state`]
    },
    {
        century: `1900s`,
        name: `Franklin D. Roosevelt`,
        lifespan: `(1882-1945)`,
        image: `../images/portraits/Franklin_D._Roosevelt.jpg`,
        bio: `Roosevelt, commonly known as FDR was the 32nd President of the United States, serving from 1933 until his death in 1945. He is the only U.S. president to have been elected to four terms in office. He is most known for his New Deal policies, a series of programs aimed to provide relief, recovery, and reform to the American economy and society in response to the Great Depression. FDR led the United States through most of World War II, making the decision to enter the war after the Japanese attack on Pearl Harbor in 1941.`,
        notableWork: `../images/notableWorks/Franklin_D._Roosevelt_act.jpeg`,
        descriptionOfWork: `Roosevelt put in action many landmark legislations including Social Security Act (1935), establishing a system of social insurance, providing benefits for the elderly, unemployed, and disabled. Fair Labor Standards Act (1938) continued expanding the role of federal government in providing a safety net for vulnerable citizens by improving working conditions and wages for many Americans.`,
        traits: [`head of state`]
    },
    {
        century: `1900s`,
        name: `Nelson Mandela`,
        lifespan: `(1918-2013)`,
        image: `../images/portraits/Nelson_Mandela.jpg`,
        bio: `He was a South African anti-apartheid revolutionary, political leader, and philanthropist who served as President of South Africa. He was the country's first black head of state and the first elected in a fully representative democratic election. His government focused on dismantling the legacy of apartheid by fostering racial reconciliation.`,
        notableWork: `../images/notableWorks/Nelson_Mandela_robben.jpeg`,
        descriptionOfWork: `During his time on Robben Island, Mandela and his fellow political prisoners faced harsh conditions, including hard labor, limited communication with the outside world, and poor living conditions. He was held there for 18 of his 27 years in prison, from 1964 to 1982.`,
        traits: [`activist`, `head of state`]
    },
    {
        century: `1900s`,
        name: `Mahatma Gandhi`,
        lifespan: `(1869-1948)`,
        image: `../images/portraits/Mahatma_Gandhi.jpg`,
        bio: `Gandhi is revered as the father of the Indian independence movement and a global symbol of nonviolent resistance as his life and philosophy continues to inspire generations seeking justice, equality, and peace. Gandhi emerged as a leader in the struggle for Indian independence from British colonial rule. He promoted nonviolent civil disobedience as a potent weapon against oppression. His efforts bore fruit when India gained independence in 1947, marking a triumph of his vision for a united, democratic nation.`,
        notableWork: `../images/notableWorks/Mahatma_Gandhi_march.jpeg`,
        descriptionOfWork: `Gandhi's leadership during pivotal campaigns such as the Salt March of 1930, where he led thousands on a 387 kilometres journey to the Arabian Sea to protest against British salt taxes, brought international attention to India's quest for freedom. He emphasized the power of truth and moral courage in confronting injustice, inspiring movements for civil rights and social change worldwide.`,
        traits: [`activist`, `philosopher`, `writer`]
    }
]


// MAIN ROOM CLASS

class Room {

    constructor(historicalPersons) {
        this.historicalPersons = historicalPersons
        this.century = ''
        this.selectedPersons = []
        this.colors = {
            '1600s': 'linear-gradient(135deg, rgba(107, 15, 26, 0.75) 0%, rgba(255, 215, 0, 0.65) 50%, rgba(10, 31, 68, 0.75) 100%)', // Dramatic deep burgundy, bright gold, midnight blue
            '1700s': 'linear-gradient(135deg, rgba(255, 248, 231, 0.75) 0%, rgba(230, 181, 102, 0.65) 50%, rgba(30, 58, 95, 0.75) 100%)', // Academic pale cream, golden amber, deep navy
            '1800s': 'linear-gradient(135deg, rgba(92, 46, 10, 0.75) 0%, rgba(210, 105, 30, 0.65) 50%, rgba(26, 58, 26, 0.75) 100%)', // Literary dark chocolate, burnt orange, forest green
            '1900s': 'linear-gradient(135deg, rgba(160, 139, 111, 0.75) 0%, rgba(184, 115, 51, 0.65) 50%, rgba(74, 74, 74, 0.75) 100%)', // Industrial warm sepia, copper bronze, charcoal gray
        }
        // Don't load from localStorage in constructor - century is not set yet
    }

    saveToLocalStorage() {
        localStorage.setItem(`room_${this.century}`, JSON.stringify({
            century: this.century,
            selectedPersons: this.selectedPersons,
            color: this.colors[this.century]
        }))
    }

    loadFromLocalStorage() {
        try {
            let roomData = localStorage.getItem(`room_${this.century}`)
            if (roomData) {
                let parsedData = JSON.parse(roomData)
                this.selectedPersons = parsedData.selectedPersons || []
                this.color = parsedData.color
                this.century = parsedData.century
            }

        }
        catch (error) {
            console.error('Error loading room data:', error)
            this.selectedPersons = []
        }

        
    }

    showCenturyPersons(century) {
        return this.historicalPersons.filter(person => person.century === century)
    }

    selectPerson(person) {
        // Check if person already exists by name
        const exists = this.selectedPersons.some(p => p.name === person.name)
        if (!exists) {
            this.selectedPersons.push(person)
            this.saveToLocalStorage()
        }
    }

    removeSelectedPerson(person) {
        this.selectedPersons = this.selectedPersons.filter(p => p.name !== person.name)
        this.saveToLocalStorage()
    }

    getSelectedPersons() {
        return this.selectedPersons
    }

    clearSelectedPersons() {
        this.selectedPersons = []
        this.saveToLocalStorage()
    }

}

export { historicalPersons, Room }