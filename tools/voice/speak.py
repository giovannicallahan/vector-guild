"""Turn Mira's written briefing into words a voice can read aloud."""
import re
SUP = {'²':' squared','³':' cubed','⁴':' to the power 4','⁵':' to the power 5','⁶':' to the power 6','⁷':' to the power 7','ⁿ':' to the power n'}
SUB = {'ᵢ':' i','₁':' 1','₂':' 2','ₙ':' n','ₖ':' k','₊':' plus'}
GREEK = {'λ':'lambda','θ':'theta','Σ':'sigma','σ':'sigma','μ':'mu','α':'alpha','π':'pi','ℓ':'l'}
def spoken(t):
    t = t.replace('’', "'").replace('“', '').replace('”', '').replace('′', ' prime')
    t = re.sub(r'‖([^‖]+)‖', r'the length of \1', t)
    t = t.replace('⁻¹', ' inverse ').replace('ᵀ', ' transpose ').replace('⁺', ' plus ')
    t = re.sub(r'\|\|([^|]+)\|\|', r'the length of \1 ', t)
    t = t.replace('< means', 'the less-than sign means').replace('> means', 'the greater-than sign means').replace('≥ means', 'the at-least sign means').replace('≤ means', 'the at-most sign means')
    t = t.replace(')/(', ') over (').replace('the sign +', 'the sign plus')
    for k, v in {**SUP, **SUB}.items(): t = t.replace(k, v)
    for k, v in GREEK.items(): t = t.replace(k, ' ' + v + ' ')
    t = t.replace('∇', 'the gradient of ').replace('√', 'the square root of ').replace('°', ' degrees')
    t = t.replace('×', ' times ').replace('÷', ' divided by ').replace('⊗', ' tensor ').replace('·', ' dot ')
    t = t.replace('≤', ' is at most ').replace('≥', ' is at least ').replace('½', ' one half')
    t = re.sub(r'(\d)\s*–\s*(\d)', r'\1 to \2', t).replace('–', ', ')
    t = t.replace('−', ' minus ')
    t = re.sub(r'\+\s*(?=\d)', ' plus ', t)
    t = t.replace('>', ' greater than ').replace('<', ' less than ')
    t = re.sub(r'(\d)\s*/\s*(\d)', r'\1 over \2', t)
    t = re.sub(r'\s=\s', ' equals ', t).replace('=', ' equals ')
    t = re.sub(r'\s?\+\s', ' plus ', t)
    t = re.sub(r'(?<=[\dA-Za-z)])\+(?=[\dA-Za-z(])', ' plus ', t)
    t = re.sub(r'(\d),(\d{3})\b', r'\1\2', t)
    return re.sub(r'\s+', ' ', t).replace(' ,', ',').replace(' .', '.').strip()
if __name__ == '__main__':
    import json, sys
    for p in sys.argv[1:]:
        for k, v in json.load(open(p)).items():
            s = spoken(v)
            bad = sorted(set(ch for ch in s if ord(ch) > 127))
            if bad: print('LEFT', k, bad)
            m = re.findall(r"[^.]*(?:squared|transpose|inverse|lambda|length of|gradient|square root|equals|over|minus|\^|\*|\||<|>|\[|\{)[^.]*\.", s)
            for x in m[:1]: print(k, '|', x.strip()[:230])
