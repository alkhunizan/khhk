import React from 'react';

export const Introduction: React.FC = () => {
  return (
    <section className="bg-white rounded-lg shadow-md p-6 md:p-8 my-8 border border-slate-200">
      <h2 className="text-2xl font-bold font-amiri text-teal-800 mb-4 text-center">بسم الله الرحمن الرحيم</h2>
      <div className="space-y-4 text-slate-700 leading-relaxed text-center font-amiri text-lg">
        <p>الحمد لله والصلاة والسلام على رسول الله وعلى آله وصحبه وسلم تسليما كثيراً، وبعد:</p>
        <p className="italic">
          في الحديث الصحيح عن رسول الله صلى الله عليه وسلم أنه قال:
          <br />
          <span className="font-bold text-green-800">"من أحب أن يبسط له في رزقه، وأن ينسأ له في أثره، فليصل رحمه."</span>
        </p>
        <p>باسم أسرتنا الكريمة نُحييكم ونعود لكم والعودُ أحمد في دوريتنا الشهرية، وبحلةٍ جديدة بحول الله وقوته.</p>
        <p>نسأل الله العظيم أن يمنّ علينا بدوام الوصل والتواصل ويُنسأ لنا في أعمارنا، وبالله التوفيق.</p>
      </div>
    </section>
  );
};