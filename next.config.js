const { withAxiom } = require('next-axiom');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['s4.anilist.co'],
    }
}

module.exports = withAxiom(nextConfig)
