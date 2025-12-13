"use client";

import { IconArrowLeft, IconArrowRight, IconMessageCircle } from "@tabler/icons-react";
import { useState } from "react";

export const AnimatedTestimonials = ({
  testimonials,
}: {
  testimonials: any[];
}) => {
  const [active, setActive] = useState(0);

  const next = () => {
    setActive((i) => (i + 1) % testimonials.length);
  };

  const prev = () => {
    setActive((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  const goTo = (index: number) => {
    setActive(index);
  };

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-8 overflow-hidden">
      {/* Titre centré */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <IconMessageCircle className="w-7 h-7 text-green-500" />
          <span className="text-green-500 font-bold tracking-widest uppercase text-sm">
            Conversations Réelles
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
          Ce que disent
          <br />
          <span className="bg-gradient-to-r from-red-500 via-green-500 to-red-500 bg-clip-text text-transparent">
            nos clients
          </span>
        </h2>
      </div>

      {/* Layout : Screenshot + Témoignage côte à côte */}
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* GAUCHE : Screenshot de conversation */}
        <div className="relative">
          {/* Container style téléphone */}
          <div className="relative mx-auto max-w-sm">
            {/* Cadre téléphone */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl border-8 border-gray-700">
              {/* Encoche/notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-10" />
              
              {/* Écran */}
              <div className="relative bg-white rounded-[2.5rem] overflow-hidden h-[600px]">
                {/* Screenshot de conversation */}
                <img
                  src={testimonials[active].src}
                  alt={`Conversation avec ${testimonials[active].name}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                
                {/* Badge WhatsApp/Messenger style */}
                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                  <IconMessageCircle className="w-4 h-4" />
                  Conversation
                </div>
              </div>
            </div>

            {/* Ombre portée */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-green-500/20 blur-3xl -z-10 scale-90" />
          </div>
        </div>

        {/* DROITE : Message du client */}
        <div className="space-y-6">
          {/* Carte de témoignage */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Citation */}
            <blockquote className="mb-6">
              <p className="text-2xl lg:text-3xl font-bold text-white leading-relaxed">
                "{testimonials[active].quote}"
              </p>
            </blockquote>

            {/* Infos client */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white">
                  {testimonials[active].name}
                </h3>
                <p className="text-green-400 font-medium mt-1">
                  {testimonials[active].designation}
                </p>
              </div>
              
              {/* Badge étoiles */}
              <div className="bg-gradient-to-br from-red-500 to-green-500 rounded-2xl px-4 py-2">
                <div className="flex gap-1 text-white text-lg">
                  {"★★★★★"}
                </div>
              </div>
            </div>

            {/* Barre décorative */}
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-green-500 rounded-full mt-6" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Réponse", value: "Rapide" },
              { label: "Qualité", value: "Top" },
              { label: "Service", value: "5/5" }
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-3 text-center"
              >
                <div className="text-lg font-black text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-white/60 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation en bas - UNIQUEMENT boutons et dots */}
      <div className="mt-12 flex flex-col items-center gap-6">
        {/* Contrôles */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center transition-colors"
          >
            <IconArrowLeft className="w-5 h-5 text-white" />
          </button>

          {/* Dots */}
          <div className="flex gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all rounded-full ${
                  i === active
                    ? "w-10 h-2.5 bg-green-500"
                    : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Aller au témoignage ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-green-500 hover:shadow-xl hover:shadow-green-500/50 flex items-center justify-center transition-shadow"
          >
            <IconArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Compteur */}
        <div className="text-center text-white/40 font-mono text-sm">
          {(active + 1).toString().padStart(2, "0")} / {testimonials.length.toString().padStart(2, "0")}
        </div>
      </div>
    </section>
  );
};